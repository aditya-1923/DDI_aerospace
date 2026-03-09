
import React, { useMemo, useState, useCallback } from "react";
import {
  Card, CardContent, Grid, Divider, IconButton, Tooltip, Dialog, DialogTitle, DialogContent,
  ToggleButton,
  ToggleButtonGroup,
  DialogActions,
  FormControl,
  InputLabel,
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
  Chip,
  Box, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Checkbox
} from "@mui/material";

import InfoIcon from "@mui/icons-material/Info";
import CloseIcon from '@mui/icons-material/Close';
import DropDownSelect from "../Form/DropdownSelect";
import { subnet_details } from "../../services/ipamIpReservationService";
import SubnetIpsDataTable from "./SubnetIpsDataTable";

const labelStyle = {
  textAlign: "right",
  pr: 1,
  fontWeight: 500,
};

const IpReservationCard = () => {

  const [requestType, setRequestType] = useState("ir");
  const [actionType, setActionType] = useState("reserve");
  const [locationCode, setLocationCode] = useState("");
  const [subnetIp, setSubnetIp] = useState("");
  const [showDetails, setShowDetails] = useState(false);

  const [locationError, setLocationError] = useState("");
  const [subnetError, setSubnetError] = useState("");
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");
  const [locationSubnets, setLocationSubnets] = useState([]);
  const [subnetDetails, setSubnetDetails] = useState(null);
  const [allSubnetIps, setAllSubnetIps] = useState([]);

  // Subnet flow results & details
  const [subnetNumber, setSubnetNumber] = useState("");
  const [subnetAdvertised, setSubnetAdvertised] = useState("");
  const [ibEaDetails, setIbEaDetails] = useState(null);
  const [cmdbEaDetails, setCmdbEaDetails] = useState(null);
  const [alreadyReservedRange, setAlreadyReservedRange] = useState([]);
  const [action, setAction] = useState("reserve");


  const [infoOpen, setInfoOpen] = useState(false);
  const [ipFilter, setIpFilter] = useState("free");
  const [domain, setDomain] = useState("");

  const [selectedIps, setSelectedIps] = useState([]);


  const domainOptions = [
    { value: "1", label: "Domain 1" },
    { value: "2", label: "Domain 2" },
    { value: "3", label: "Domain 3" },
  ];




  // Centralize restricted prefixes (per your legacy jQuery flow)
  const RESTRICTED_PREFIXES = ["192.35.", "10.141."];

  /** Classify input into location vs subnet/ip */
  const classifyInput = (value) => {
    const v = (value || "").trim().toLowerCase();
    const subnetRegex = /^(3|10|192)\.(\d{1,3}\.){2}\d{1,3}\/\d{1,2}$/;
    const ipRegex = /^(3|10|192)\.(\d{1,3}\.){2}\d{1,3}$/;

    if (/(^as-|^am-|^em-)/.test(v) && v.includes("-")) return "location";
    if (subnetRegex.test(v) || ipRegex.test(v)) return "subnet";
    return "";
  };

  const isRestrictedSubnet = (netOrIp) =>
    RESTRICTED_PREFIXES.some((prefix) => (netOrIp || "").startsWith(prefix));



  // ---------- Derived UI flags ----------
  const allowOperation = useMemo(() => {
    // Mirrors your legacy behavior: allow even if data is incomplete.
    // If you need stricter checks, compute based on EA details here.
    return true;
  }, [cmdbEaDetails, ibEaDetails]);

  const completeInfoGiven = useMemo(() => {
    // Very simple heuristic. Adapt if certain fields are mandatory.
    if (!cmdbEaDetails || !ibEaDetails) return false;
    const anyEmptyInIb = Object.values(ibEaDetails || {}).some(
      (v) => (v ?? "") === ""
    );
    return !anyEmptyInIb;
  }, [cmdbEaDetails, ibEaDetails]);

  const hasAnyResults =
    (locationSubnets && locationSubnets.length > 0) ||
    (allSubnetIps && allSubnetIps.length > 0);

  const getSubnetDetails = useCallback(
    async (ge_subnet_input, mode) => {
      setError("");
      setSubnetError("");
      setLocationError("");
      setLoading(true);

      // Reset prior results
      setLocationSubnets([]);
      setAllSubnetIps([]);
      setSubnetNumber("");
      setSubnetAdvertised("");
      setIbEaDetails(null);
      setCmdbEaDetails(null);
      setAlreadyReservedRange([]);
      setSelectedIps([]);

      const trimmed = (ge_subnet_input || "").trim();

      // Mode-specific validation
      if (mode === "location") {
        const type = classifyInput(trimmed);
        if (type !== "location") {
          if (trimmed.length <= 6) {
            setLocationError("Please enter valid location code");
          }
          else {
            setLocationError("Location Code should start with AS-, AM-, EM-");
          }
          setLoading(false);
          return;
        }
      }
      else if (mode === "subnet") {
        if (isRestrictedSubnet(trimmed)) {
          setSubnetError("This subnet is Restricted");
          setLoading(false);
          return;
        }
        const type = classifyInput(trimmed);
        if (type !== "subnet") {
          setSubnetError(
            "Please enter valid Subnet/IP (e.g., 10.x.x.x/24 or 10.x.x.x)"
          );
          setLoading(false);
          return;
        }
      }

      try {
        const resp = await subnet_details({
          subnet: trimmed,
          req_for: requestType,
        });

        const response = resp?.data || resp;
        if (!response || (response.status || "").toLowerCase() !== "success") {
          const msg = response?.result || response?.message || "Failed to fetch subnet details";
          if (mode === "location") setLocationError(msg);
          else setSubnetError(msg);
          return;
        }

        if (mode === "location") {
          const list = Array.isArray(response.result) ? response.result : [];
          setLocationSubnets(list);
        }
        else {
          // SUBNET/IP flow
          const resolvedSubnet = response.subnet || trimmed;

          // Re-check restricted on returned subnet
          if (isRestrictedSubnet(resolvedSubnet)) {
            setSubnetError("This subnet is Restricted");
            return;
          }

          setSubnetNumber(resolvedSubnet);
          setSubnetAdvertised(response.subnet_advertised ?? "");
          setIbEaDetails(response.ib_ea_details || {});
          setCmdbEaDetails(response.cmdb_ea_details || {});
          setAlreadyReservedRange(response.already_reserved_range || []);
          setAllSubnetIps(response.all_subnet_ips || []);
        }
      } catch (e) {
        console.error(e);
        setError("Network or server error while fetching subnet details.");
      } finally {
        setLoading(false);
      }
    },
    [requestType]
  );

  const handleSearch = async () => {
    setError("");
    setSubnetError("");
    setLocationError("");

    const loc = locationCode.trim();
    const sub = subnetIp.trim();

    if (!loc && !sub) return;

    if (sub) {
      await getSubnetDetails(sub, "subnet");
    } else if (loc) {
      await getSubnetDetails(loc, "location");
    }
  };

  const pingIPsApi = async (ipList) => {
    // Example: mark all as "Unknown". Replace with real API call.
    const out = {};
    ipList.forEach((ip) => (out[ip] = "Unknown"));
    return out;
  };

  // ---------- Render helpers ----------
  const renderSubnetInfoHeader = () => {
    if (!subnetNumber) return null;

    return (
      <Box mb={3}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center" gap={1}>
            <Typography variant="h6">
              Subnet: <strong>{subnetNumber}</strong>
            </Typography>

            <Tooltip title="View location details">
              <IconButton size="small" onClick={() => setInfoOpen(true)}>
                <InfoIcon color="primary" />
              </IconButton>
            </Tooltip>
          </Box>

          <Box display="flex" alignItems="center" gap={2}>
            <Button size="small" variant="contained" onClick={pingIPsApi}>
              Check Ping Status
            </Button>

            <Typography
              variant="body2"
              id="toggle_status"
              sx={{
                cursor: "pointer",
                fontWeight: 600,
                px: 2,
                py: 0.5,
                borderRadius: 1,
                backgroundColor: ipFilter === "free" ? "#e8f5e9" : "#ffebee",
                color: ipFilter === "free" ? "#2e7d32" : "#c62828",
                border: "1px solid",
                borderColor: ipFilter === "free" ? "#81c784" : "#ef9a9a",
              }}
              onClick={() =>
                setIpFilter((prev) => (prev === "free" ? "used" : "free"))
              }
            >
              {ipFilter === "free" ? "Free" : "Used"}
            </Typography>
          </Box>
        </Box>

        <Box
          mt={2}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography>
            VLAN: <strong>{ibEaDetails?.VLAN || "N/A"}</strong>
          </Typography>

          <Grid size={{ sx: 12, sm: 6 }}>
            <Typography>Domain</Typography>
            <DropDownSelect
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              options={domainOptions}
            />
          </Grid>
        </Box>

        {/* ================= INFO POPUP ================= */}
        <Dialog
          open={infoOpen}
          onClose={() => setInfoOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle
            sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
          >
            <Box display="flex" alignItems="center" gap={1}>
              <i className="fa fa-flag me-2 text-primary fa-2x"></i>
              <h3
                className="m-0 text-primary"
                id="subnet_ea_details_model-title"
                style={{ display: "inline !important" }}
              >
                Subnet/Location Details
              </h3>
            </Box>

            {/* CROSS ICON */}
            <IconButton onClick={() => setInfoOpen(false)} size="small">
              <CloseIcon />
            </IconButton>
          </DialogTitle>

          <DialogContent>
            {/* ===== STATUS CHIPS INSIDE DIALOG ===== */}
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              {String(subnetAdvertised).length > 0 && (
                <Chip
                  size="small"
                  label={`Advertised: ${String(subnetAdvertised)}`}
                  color="info"
                  variant="outlined"
                />
              )}
            </Box>

            {/* ===== LOCATION DETAILS GRID ===== */}
            <Grid container spacing={3}>
              {/* CMDB Column */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="subtitle1">
                  Location Details in CMDB
                </Typography>
                <Divider sx={{ my: 1 }} />

                <Table size="small">
                  <TableBody>
                    {cmdbEaDetails && Object.keys(cmdbEaDetails).length > 0 ? (
                      Object.entries(cmdbEaDetails).map(([k, v]) => (
                        <TableRow key={k}>
                          <TableCell sx={{ width: 160 }}>
                            <strong>{k}</strong>
                          </TableCell>
                          <TableCell>
                            {k === "Active" && String(v) === "false" ? (
                              <span style={{ color: "#dc3545" }}>
                                {String(v)} (Inactive)
                              </span>
                            ) : (
                              String(v ?? "")
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>

                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </Grid>

              {/* IPAM Column */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="subtitle1">
                  Location Details in IPAM
                </Typography>
                <Divider sx={{ my: 1 }} />

                <Table size="small">
                  <TableBody>
                    {ibEaDetails && Object.keys(ibEaDetails).length > 0 ? (
                      Object.entries(ibEaDetails).map(([k, v]) => (
                        <TableRow key={k}>
                          <TableCell sx={{ width: 160 }}>
                            <strong>{k}</strong>
                          </TableCell>
                          <TableCell>
                            {String(v ?? "") === "" ? (
                              <span style={{ color: "#dc3545" }}>Info is Missing</span>
                            ) : (
                              String(v)
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={2} align="center" sx={{ color: "#888" }}>
                          No IPAM data
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </Grid>
            </Grid>
          </DialogContent>

        </Dialog>
      </Box>
    );
  };

  const renderLocationSubnetsTable = () => {
    if (!locationSubnets?.length) return null;

    return (
      <Box mt={4}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Subnets for Location
            </Typography>

            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Subnet</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>DHCP Utilization</TableCell>
                    <TableCell>IPAM/DHCP Reserved</TableCell>
                    <TableCell>VLAN</TableCell>
                    <TableCell>Location Code</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {locationSubnets.map((row) => {
                    const util = Number(row.ipam_dhcp_utilization || 0);
                    return (
                      <TableRow key={row.subnet} hover>
                        <TableCell>{row.subnet}</TableCell>
                        <TableCell>{row.name || "-"}</TableCell>
                        <TableCell sx={{ minWidth: 180 }}>
                          <Box display="flex" flexDirection="column" gap={0.5}>
                            <LinearProgress
                              variant="determinate"
                              value={Math.max(0, Math.min(util, 100))}
                              color="success"
                            />
                            <Typography variant="caption">{util}%</Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          {(row.ipam_reserve_count || 0) +
                            "/" +
                            (row.dhcp_reserve_count || 0)}
                        </TableCell>
                        <TableCell>{row.vlan || "-"}</TableCell>
                        <TableCell>{row.location_code || "-"}</TableCell>
                        <TableCell>
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => {
                              setSubnetIp(row.subnet);
                              setLocationCode("");
                              getSubnetDetails(row.subnet, "subnet");
                            }}
                          >
                            View IPs
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

      </Box>
    );
  };

  const renderSubnetIpsTable = () => {
    if (!allSubnetIps?.length) return null;

    return (
      <Box mt={4}>
        <Card>
          <CardContent>
            {renderSubnetInfoHeader()}

            <SubnetIpsDataTable
              rows={allSubnetIps}
              action={actionType}
              allowOperation={allowOperation}
              selectedIps={selectedIps}
              setSelectedIps={setSelectedIps}
              ipFilter={ipFilter}
            />

            {/* Optional submit bar */}
            <Box mt={2} textAlign="right">
              {selectedIps.length > 0 && (
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Selected IPs: {selectedIps.join(", ")}
                </Typography>
              )}
              <Button
                variant="contained"
                disabled={selectedIps.length === 0 || !allowOperation}
                onClick={() => {
                  // TODO: Call your backend to reserve/release/modify based on actionType & selectedIps
                  // e.g., submitSelectedIps(actionType, selectedIps, { requestType, subnetNumber, ... })
                  console.log("Submit action:", actionType, selectedIps);
                }}
              >
                {actionType === "reserve"
                  ? "Reserve"
                  : actionType === "release"
                    ? "Release"
                    : "Modify"}{" "}
                Selected
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    );
  };

  return (
    <Box component="section" sx={{ width: "100%" }}>
      <Card>
        <CardContent>
          <Grid container spacing={2} alignItems="center">

            {/* LEFT COLUMN */}
            <Grid size={{ xs: 12, md: 6 }}>

              {/* Row 1: Select Request */}
              <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
                <Grid size={4}>
                  <Typography sx={labelStyle}>Select Request *</Typography>
                </Grid>
                <Grid size={7}>
                  <FormControl fullWidth size="small">
                    <Select
                      value={requestType}
                      onChange={(e) => setRequestType(e.target.value)}
                    >
                      <MenuItem value="ir">Static IP</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              {/* Row 2: Select Action */}
              <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
                <Grid size={4}>
                  <Typography sx={labelStyle}>Select Action *</Typography>
                </Grid>
                <Grid size={7}>
                  <FormControl fullWidth size="small">
                    <Select
                      value={actionType}
                      onChange={(e) => setActionType(e.target.value)}
                    >
                      <MenuItem value="reserve">Reserve</MenuItem>
                      <MenuItem value="modify">Modify</MenuItem>
                      <MenuItem value="release">Release</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

            </Grid>

            {/* RIGHT COLUMN */}
            <Grid size={{ sx: 12, md: 6 }}>
              <Grid container spacing={2} alignItems="center" sx={{ mb: 1 }}>
                <Grid size={5}>
                  <Typography sx={labelStyle}>Location Code *</Typography>
                </Grid>
                <Grid size={7}>

                  <TextField
                    fullWidth
                    size="small"
                    value={locationCode}
                    onChange={(e) => setLocationCode(e.target.value)}
                    placeholder="Enter Location Code"
                    disabled={subnetIp !== "" || loading}
                    error={!!locationError}
                    helperText={locationError}
                  />
                </Grid>
              </Grid>

              <Grid container justifyContent="center" sx={{ mb: 1 }}>
                <Typography fontSize={12}>OR</Typography>
              </Grid>

              <Grid container spacing={2} alignItems="center" sx={{ mb: 1 }}>
                <Grid size={5}>
                  <Typography sx={labelStyle}>Subnet/IP Address *</Typography>
                </Grid>
                <Grid size={7}>
                  <TextField
                    fullWidth
                    size="small"
                    value={subnetIp}
                    onChange={(e) => setSubnetIp(e.target.value)}
                    placeholder="Enter Subnet/IP Address"
                    disabled={locationCode !== "" || loading}
                    error={!!subnetError}
                    helperText={subnetError}
                  />

                </Grid>
              </Grid>

            </Grid>

          </Grid>

          <Box mt={3} textAlign="right">
            <Button
              variant="contained"
              disabled={loading || (!locationCode && !subnetIp)}
              onClick={handleSearch}
            >
              {loading ? "Searching..." : "Search"}
            </Button>
          </Box>
        </CardContent>
      </Card>

      {renderLocationSubnetsTable()}
      {renderSubnetIpsTable()}

      {/* (Optional) You can place global actions here */}
      {hasAnyResults && (
        <Box mt={2} textAlign="right">
          {/* Reserved for additional global actions if needed */}
        </Box>
      )}
    </Box>
  );
};

export default IpReservationCard;
