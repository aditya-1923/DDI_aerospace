import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  Box,
  Grid,
  Typography,
  Paper,
  Button,
  TextField,
  IconButton,
  Tooltip,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  CircularProgress,
  InputAdornment,
  FormControl,
  Divider
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import InfoIcon from "@mui/icons-material/Info";
import SearchIcon from "@mui/icons-material/Search";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

// import { DropDownSelect } from "../components/form/index"
import DropDownSelect from "./Form/DropdownSelect";
// import {DropDownSelect} from "./form/DropdownSelect";

import { add_dns_data } from "../services/addDnsService";
import { useFetchOnce } from "../hooks/useFetchOnce";

/* ---------------- Validators ---------------- */
const isIPv4 = (v) =>
  /^(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(\1)\.(\1)\.(\1)$/.test(v);

const isHostname = (v) =>
  /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v);

export default function AddDomainForm() {

  /* ---------------- State ---------------- */
  const [changeFor, setChangeFor] = useState("");
  const [businessAffected, setBusinessAffected] = useState("");

  const [reason, setReason] = useState("");
  const [justification, setJustification] = useState("");

  const [ciName, setCiName] = useState("");
  const [ciError, setCiError] = useState("");
  const [ciSupport, setCiSupport] = useState("");
  const [ciLoading, setCiLoading] = useState(false);

  const [vault, setVault] = useState("no");

  const [recordType, setRecordType] = useState("");
  const [domainName, setDomainName] = useState(null);
  const [recordName, setRecordName] = useState("");
  const [ipAddressValue, setIpAddressValue] = useState("");

  const [disclaimer, setDisclaimer] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [apiError, setApiError] = useState("");

  const [errors, setErrors] = useState({});

  const [recordNameErrors, setRecordNameErrors] = useState({ recordName: "" });
  const [ipError, setIpError] = useState({});

  const [dataloading, setLoading] = useState(false);

  /* ---------------- Options ---------------- */
  const changeForOptions = [{ value: "1", label: "Internal DNS" }];


  const { data, loading, error } = useFetchOnce(add_dns_data, [], 2, 1000);

  const recordTypeOptions = useMemo(
    () => data?.record_types?.map((r) => ({ value: String(r.id), label: r.type })) || [],
    [data]
  );

  const businessOptions = useMemo(
    () => data?.business?.map((b) => ({ value: b.business_name, label: b.business_name })) || [],
    [data]
  );

  const reasonOptions = useMemo(
    () => data?.reasons?.map((r) => ({ value: r.id, label: r.name })) || [],
    [data]
  );

  const domainTypeByChangeFor = useMemo(() => {
    if (changeFor === "1") return "Internal";
    if (changeFor === "2") return "External";
    return null;
  }, [changeFor]);

  const combinedDomains = useMemo(() => {
    if (!data) return [];
    return [
      ...(data.domains || []).map((d) => ({
        label: d.name,
        value: d.name,
        type: "Internal"
      })),
      ...(data.external_host || []).map((d) => ({
        label: d.name,
        value: d.name,
        type: "External"
      }))
    ];
  }, [data]);

  console.log(typeof (recordType));

  const filteredDomains = useMemo(() => {
    return combinedDomains.filter((d) => {
      // Filter by Change For
      if (domainTypeByChangeFor && d.type !== domainTypeByChangeFor) {
        return false;
      }

      // Filter by search text
      if (
        searchText &&
        !d.label.toLowerCase().includes(searchText.toLowerCase())
      ) {
        return false;
      }

      return true;
    });
  }, [combinedDomains, domainTypeByChangeFor, searchText]);



  const fqdn = recordName && domainName ? `${recordName}.${domainName.value}` : "";

  const previousRecordNameRef = useRef("");
  const resetRecordFields = () => {
    setDomainName(null);
    setRecordName("");
    setIpAddressValue("");
    setSearchText("");
    setRecordNameErrors({});
    previousRecordNameRef.current = "";
  };

  useEffect(() => {
    resetRecordFields();
  }, [recordType, changeFor]);


  const validateCI = async () => {
    if (!ciName.trim()) {
      setCiError("Please enter Application CI");
      setCiSupport("");
      return false;
    }

    setCiError("");
    setCiSupport("");
    setCiLoading(true);

    try {
      const res = await fetch(
        `/dns/validate/ci?ci_name=${encodeURIComponent(ciName)}`
      );

      const data = await res.json();

      if (data.status !== "success") {
        setCiError(data.msg);
        return false;
      }

      setCiSupport(data.msg || "NA");
      return true;
    } catch (e) {
      setCiError("Unable to validate CI");
      return false;
    } finally {
      setCiLoading(false);
    }
  };


  function validateRecordName(str, chgType = "create") {
    const value = str?.trim();

    // Empty input
    if (!value) {
      return { valid: false, message: "Please enter Record Name" };
    }

    // Choose regex based on change type
    let regexp;
    if (chgType === "create" || chgType === "modify") {
      regexp = /^[a-zA-Z0-9-_]+$/;
    } else {
      regexp =
        /^(([a-zA-Z0-9_]|[a-zA-Z0-9_][a-zA-Z0-9\-_]*[a-zA-Z0-9_])\.)*([A-Za-z0-9_]|[A-Za-z0-9_][A-Za-z0-9\-_]*[A-Za-z0-9_])$/;
    }

    // Regex check
    if (!regexp.test(value)) {
      return { valid: false, message: "Invalid Record Name" };
    }

    // Valid
    return { valid: true, message: "" };
  }


  const [ipDisabled, setIpDisabled] = useState(true);

  const [isAliasDisabled, setAliasDisabled] = useState(true);

  const handleRecordNameBlur = () => {
    const value = recordName?.trim();

    // Validate record name
    const { valid, message } = validateRecordName(value, "create");
    if (!valid) {
      setRecordNameErrors((prev) => ({ ...prev, recordName: message }));
      setIpDisabled(true);
      setAliasDisabled(true);
      return;
    }

    // Clear errors
    setRecordNameErrors((prev) => ({ ...prev, recordName: null }));
    setIpDisabled(false);
    setAliasDisabled(false);

    // Skip if value hasn't changed
    if (previousRecordNameRef.current === value) {
      setIpDisabled(false);
      setAliasDisabled(false);
      return;
    }

    // Store current value
    previousRecordNameRef.current = value;

    // Call backend if record type is valid
    const recordTypeMap = {
      "1": "a",
      "2": "cname",
      "3": "ptr",
    };

    const type = recordTypeMap[recordType];
    if (type) {
      checkSysRecord(type);
    }
  };

  const checkSysRecord = async (rn) => {
    if (!domainName) return;

    setLoading(true);
    const chgFor = changeFor;
    const url = `/sys/v3/${rn}/${domainName.value}/${recordName}?chg_for=${chgFor}`;

    try {
      const res = await fetch(url);
      const data = await res.json();

      if (data.status === "success") {
        // Example: show modal or disable/enable IP/alias inputs
        // If needed, you can set state like:
        // setIpDisabled(true);
        // setAliasDisabled(true);
        // handle modal message here
      } else {
        // handle backend error
        // setIpDisabled(false);
        // setAliasDisabled(false);
      }
    } catch (err) {
      console.error(err);
      // setIpDisabled(false);
      // setAliasDisabled(false);
    } finally {
      setLoading(false);
    }
  };

  const checkAdpsRecord = async ({
    recType,
    zone,
    name,
    rr,
    changeFor
  }) => {

    const recTypeMap = {
      "1": "a",
      "2": "cname",
      "3": "ptr",
    };


    const type = recTypeMap[recType];

    const url = `/v3/${type}/${zone}/${name}?rr=${rr}&chg_for=${changeFor}`;

    const response = await fetch(url, {
      method: "GET"
    });

    if (!response.ok) {
      throw new Error("Failed to fetch record details");
    }

    return response.json();
  };

  function validateIPAddress(ipaddress) {
    const value = ipaddress?.trim();
    // Basic IPv4 regex
    const ipv4Regex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

    if (!ipv4Regex.test(value)) {
      return { valid: false, message: "Invalid IP Address" };
    }

    // GE private IP range check
    const geIpRegex = /^10\.|3\.|223\.|146\.|147\.|151\.|161\.|165\.|168\.|170\.|172\.|192\.|198\.|199\.|203\.|204\.|205\.|207\.|208\.|98\.|129.201\.|134.236\.|144.22\.|194.9\.|152.34.12\.|152.34.7\.|166.18.9\.|200.173.216\.|200.204.171\.|200.228.24\.|216.207.228\.|216.207.240\.|216.74.188\.|63.145.140\.|64.209.43\.|64.211.110\.|64.212.225\.|64.212.98\.|64.214.209\.|64.214.210\.|64.214.70\.|64.91.76\.|65.116.0\.|65.117.168\.|65.82.181\.|66.89.51\.|68.15.167\./i;

    if (!geIpRegex.test(value)) {
      return { valid: false, message: "IP is not in GE's private IP range" };
    }

    return { valid: true, message: "" };
  }


  const handleIpAddressChnage = async () => {
    if (!recordType || !ipAddressValue || !domainName) {
      if (!ipAddressValue) {
        setIpError({ value: "Please enter IP address" }); // show error
      }
      return;
    }

    const { valid, message } = validateIPAddress(ipAddressValue);
    if (!valid) {
      setIpError((prev) => ({ ...prev, value: message }));
      return;
    }
    setIpError((prev) => ({ ...prev, value: null }));
    setLoading(true);

    try {
      const result = await checkAdpsRecord({
        recType: recordType,
        zone: domainName.value,
        name: recordName,
        rr: ipAddressValue,
        changeFor
      });

      if (result.status === "success" && result.msg?.rr?.length > 0) {
        const rrList = result.msg.rr;

        const startsWithGE =
          typeof rrList[0] === "string" && rrList[0].startsWith("GE");

        if (rrList.length === 1 && startsWithGE) {
          setModalData({
            mode: "ticket",
            ticket: rrList[0]
          });
        } else {
          setModalData({
            mode: "existing",
            rrList,
            reason: result.msg.reason,
            warning: result.msg.warning,
            ptr: result.msg.ptr === "true"
          });
        }

        setShowModal(true);
      } else {
        // No existing record → enable selectors / submit
        setSelectorsEnabled(true);
      }
    } catch (error) {
      console.error("API error:", error);
      setApiError("Unable to validate record");
    } finally {
      setLoading(false);
    }
  };

  const isDomainNameDisabled = !changeFor || !businessAffected

  const isFormFilled =
    Boolean(
      changeFor &&
      businessAffected &&
      reason &&
      justification &&
      ciName &&
      recordType &&
      domainName &&
      recordName &&
      ipAddressValue
    );

  const isSubmitEnabled = isFormFilled && disclaimer;


  /* ---------------- Submit ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Basic front-end validation
    if (!changeFor || !businessAffected || !reason || !justification || !ciName || !recordType || !ipAddressValue) {
      alert("Please fill all mandatory fields");
      return;
    }

    // 2. Check CI validity
    const ciValid = await validateCI();
    if (!ciValid) {
      alert("Invalid CI. Please correct before submitting.");
      return;
    }

    // 3. Check IP address (if record type requires it)
    if (recordType === "1") {
      const { valid, message } = validateIPAddress(ipAddressValue);
      if (!valid) {
        setIpError({ value: message });
        alert(message);
        return;
      }
    }

    // 4. Check disclaimer checkbox
    if (!disclaimer) {
      alert("Please accept the Terms Of Use");
      return;
    }

    // 5. All validations passed → Submit
    const payload = {
      ChangeFor: changeFor,
      Addba: businessAffected,
      reasonAdd: reason,
      justiAdd: justification,
      ci_name: ciName,
      vault: vault,
      resultInput: "",
      reqType: parseInt(recordType),
      zone: domainName?.value,
      preference: 0,
      sname: recordName,
      ipv4addr: ipAddressValue,
      externalhost: 0,
      disclaimer: disclaimer ? "on" : "off",
      ext_flag_check: "no",
      reqNo: "DEMO123",
    };

    try {
      const response = await fetch("/v3/record/create/a", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(payload),
        credentials: "include",
      });

      const result = await response.json();
      if (result.status === "error") {
        alert(`Error: ${result.msg}`);
      } else {
        alert(`Request submitted successfully. Ref: ${result.chg_ref || "N/A"}`);
      }
    } catch (error) {
      console.error(error);
      alert("Submission failed. Please try again.");
    }
  };



  /* ---------------- Loading ---------------- */
  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">Failed to load data</Typography>;

  /* ---------------- UI ---------------- */
  return (
    <Paper elevation={4} sx={{ p: 4, maxWidth: 1000, mx: "auto" }}>
      <Box component="form" onSubmit={handleSubmit}>

        {/* Change For + Business */}
        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 12, md: 6 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid size={4}><Typography align="right">Change For*</Typography></Grid>
              <Grid size={8}>
                <DropDownSelect
                  value={changeFor}
                  onChange={(e) => setChangeFor(e.target.value)}
                  options={changeForOptions}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid size={4}><Typography align="right">Business Affected*</Typography></Grid>
              <Grid size={8}>
                <DropDownSelect
                  value={businessAffected}
                  onChange={(e) => setBusinessAffected(e.target.value)}
                  options={businessOptions}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        {/* Reason + Justification */}
        <Grid container spacing={2} alignItems="center" sx={{ mt: 2 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid size={4}><Typography align="right">Reason*</Typography></Grid>
              <Grid size={8}>
                <DropDownSelect
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  options={reasonOptions}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid size={4}><Typography align="right">Justification*</Typography></Grid>
              <Grid size={8}>
                <TextField
                  fullWidth
                  size="small"
                  value={justification}
                  onChange={(e) => setJustification(e.target.value)}
                  placeholder="Enter justification"
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        {/* CI */}
        <Grid container spacing={2} alignItems="center" sx={{ mt: 2 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid size={4}><Typography align="right">Your application CI</Typography></Grid>
              <Grid size={8}>
                <TextField
                  fullWidth
                  size="small"
                  value={ciName}
                  placeholder="e.g. DNS-prod"
                  error={Boolean(ciError)}
                  helperText={ciError}
                  onChange={(e) => setCiName(e.target.value)}
                  onFocus={() => { setCiError(""); setCiSupport(""); }}
                  onBlur={validateCI}
                />
              </Grid>
            </Grid>
          </Grid>


          <Grid size={{ xs: 12, md: 6 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid size={1}>
                <Tooltip title="Please input a valid ServiceNow Configuration Name e.g. DNS-prod">
                  <IconButton size="small"><InfoIcon color="info" /></IconButton>
                </Tooltip>
              </Grid>
              <Grid size={1}>{ciLoading && <CircularProgress size={18} />}</Grid>
              {ciSupport && (
                <Grid size={10}>
                  <Typography color="primary" fontSize="0.85rem">
                    <b>Support Group:</b> {ciSupport}
                  </Typography>
                </Grid>
              )}
            </Grid></Grid>
        </Grid>

        {/* Vault CI */}
        <Grid container spacing={2} alignItems="center" sx={{ mt: 2 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid size={4}><Typography align="right">Vault CI *</Typography></Grid>
              <Grid size={8}>
                <FormControl>
                  <RadioGroup row value={vault} onChange={(e) => setVault(e.target.value)}>
                    <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                    <FormControlLabel value="no" control={<Radio />} label="No" />
                  </RadioGroup>
                </FormControl>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        {/* Record Type + Domain */}
        <Grid container spacing={2} alignItems="center" sx={{ mt: 2 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid size={4}><Typography align="right">Record Type</Typography></Grid>
              <Grid size={7}>
                <DropDownSelect value={recordType} onChange={(e) => setRecordType(e.target.value)} options={recordTypeOptions} />
              </Grid>
            </Grid>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid size={4}><Typography align="right">Domain Name</Typography></Grid>
              <Grid size={6}>
                <Autocomplete
                  disabled={isDomainNameDisabled}
                  value={domainName}
                  options={filteredDomains}
                  onChange={(e, v) => setDomainName(v)}
                  onInputChange={(e, v) => setSearchText(v)}
                  getOptionLabel={(o) => o.label || ""}
                  renderInput={(params) => <TextField {...params} size="small" />}
                  sx={{
                    "& .MuiInputBase-input.Mui-disabled": {
                      WebkitTextFillColor: "#9e9e9e", // text color
                    },
                    "& .MuiOutlinedInput-root.Mui-disabled fieldset": {
                      borderColor: "#e0e0e0", // border color
                    },
                    backgroundColor: isDomainNameDisabled ? "#f5f5f5" : "inherit", // background
                  }}
                // sx={{ width: '100%' }}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        {/* Record Name + IP/Value */}
        <Grid container spacing={2} alignItems="center" sx={{ mt: 2 }}>
          <Grid size={{ xs: 12, md: 7 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid size={4}><Typography align="right">Record Name</Typography></Grid>
              <Grid size={5}>
                <TextField
                  fullWidth
                  size="small"
                  disabled={!domainName}
                  value={recordName}
                  error={!!recordNameErrors.recordName}
                  helperText={recordNameErrors.recordName}
                  placeholder="Host Name Or Server Name"
                  onChange={(e) => setRecordName(e.target.value)}
                  onBlur={handleRecordNameBlur}
                  sx={{
                    "& .MuiInputBase-input.Mui-disabled": {
                      WebkitTextFillColor: "#9e9e9e",
                    },
                    "& .MuiOutlinedInput-root.Mui-disabled fieldset": {
                      borderColor: "#e0e0e0", // border color
                    },
                    backgroundColor: !domainName ? "#f5f5f5" : "inherit", // background
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end" sx={{ display: 'flex', alignItems: 'center' }}>

                        <Divider orientation="vertical" flexItem sx={{ mr: 1 }} />
                        <IconButton onClick={handleRecordNameBlur} disabled={dataloading}>
                          <SearchIcon />
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
              <Grid size={3}><Typography color="primary">{domainName?.label}</Typography></Grid>
            </Grid>
          </Grid>

          <Grid size={{ xs: 12, md: 5 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid size={4}><Typography align="right">{recordType === "2" ? "Alias Address" : "IP Address"}</Typography></Grid>
              <Grid size={7}>
                <TextField
                  fullWidth
                  size="small"
                  disabled={!recordName || !recordType || ipDisabled || isAliasDisabled}
                  value={ipAddressValue}
                  error={!!ipError.value}
                  helperText={ipError.value}
                  onChange={(e) => setIpAddressValue(e.target.value)}
                  sx={{
                    "& .MuiInputBase-input.Mui-disabled": {
                      WebkitTextFillColor: "#9e9e9e", // text color
                    },
                    "& .MuiOutlinedInput-root.Mui-disabled fieldset": {
                      borderColor: "#e0e0e0", // border color
                    },
                    backgroundColor: isDomainNameDisabled ? "#f5f5f5" : "inherit", // background
                  }}

                  placeholder={recordType === "2" ? "Alias Address" : "IPv4 Address"}
                  onBlur={handleIpAddressChnage}
                  InputProps={{
                    endAdornment: recordType !== "3" && (
                      <InputAdornment position="end" onClick={handleIpAddressChnage} sx={{ display: 'flex', alignItems: 'center' }}>

                        <Divider orientation="vertical" flexItem sx={{ mr: 1 }} />
                        <IconButton><SearchIcon /></IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
              <Grid size={1}>
                {recordType === "1" && (
                  <Tooltip title="IP address of your application or server">
                    <IconButton size="small"><InfoOutlinedIcon color="info" /></IconButton>
                  </Tooltip>
                )}
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid size={12}>
            <Paper
              variant="outlined"
              sx={{
                p: 2,
                maxHeight: 200,
                overflowY: 'auto',
                borderColor: 'lightgray'
              }}
            >
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                Please read the terms of use:
              </Typography>

              <Typography variant="body2" paragraph>
                The Automated DNS Provisioning system is a comprehensive on-demand IT request management tool. The tool can be used by GE employees and contingent workers to initiate DNS requests for various DNS requirements, such as Add, Modify and Delete. The data elements that are captured in the tool include information about the IT asset being managed, as well as Personally Identifiable Information ("PII"). When a user initiates a request, certain PII may be pre-populated into the tool by electronic data feeds from GE, including (but not limited to) name, SSO, business/user contact information including phone number, location data, and relevant asset information. Other data, including additional PII, may be requested from the user in connection with the services being sought. Selected information may be passed to other GE applications to support the DNS service under the tool.
              </Typography>

              <Typography variant="body2" paragraph>
                The information captured in the tool can be viewed by: i) technical support staff responding to the service request, ii) System Administrators supporting the Automated DNS Provisioning system which may include contingent workers contracted by GE, or iii) GE managers/representatives performing service quality control, and service metrics analysis.
              </Typography>

              <Typography variant="body2" paragraph>
                By entering information into this tool, you acknowledge and agree that i) the information provided are accurate and validated before submitting, ii) if the request is not met automation conditions, then it will be processed as standard DNS process iii) the information may be processed consistent with the purposes described above, and iv) if you are located outside the USA, PII may be transferred outside your country to the USA and elsewhere in the world consistent with those business purposes, taking into consideration all legal obligations and governing GE policies. The PII in this application will be used in compliance with the <a href="http://security.ge.com" target="_blank" style={{ color: '#7676ee', fontSize: '0.75rem' }}>GE Employment Data Protection Standards</a>.
              </Typography>

              <Typography variant="caption" display="block">
                &copy; {new Date().getFullYear()} General Electric Company
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Disclaimer */}
        <Grid container spacing={2} alignItems="center" sx={{ mt: 2 }}>
          <Grid size={12}>
            <FormControlLabel
              control={<Checkbox checked={disclaimer} onChange={(e) => setDisclaimer(e.target.checked)} />}
              label="By using this site, you agree to abide by our Terms Of Use"
            />
            {errors.disclaimer && <Typography color="error">{errors.disclaimer}</Typography>}
          </Grid>
        </Grid>

        {/* Submit */}
        <Grid container spacing={2} justifyContent="flex-end" sx={{ mt: 2 }}>
          <Grid>
            <Button type="submit" variant="contained" disabled={!isSubmitEnabled}>Submit</Button>
          </Grid>
        </Grid>

      </Box>
    </Paper>
  );
}
