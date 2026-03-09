import React, { useState } from "react";
import {
  Box,
  Grid,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  FormHelperText,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  Button,
  Typography,
  Paper,
} from "@mui/material";
import DomainAutocomplete from "./form/DomainAutocomplete";
import DropDownSelect from "./Form/DropdownSelect";

export default function EditDnsPage() {


  const [changeFor, setChangeFor] = useState("");
  const changeForOptions = [{ value: "1", label: "Internal DNS" }];

  const [domainName, setDomainName] = useState(null);
  
  const [formData, setFormData] = useState({
    ModChangeFor: "",
    Modba: "",
    Modpc: "",
    Modcoordinate: "no",
    Modmigration: "no",
    Modbi: "",
    reasonMod: "",
    justiMod: "",
    Modoutage: "no",
    ModinlineRadioOptions: "no",
    disclaimerMod: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };


  return (
    <Box component="form" id="modify_form" sx={{ p: 3 }}>
      <Typography variant="body2" color="info.main" gutterBottom>
        <span style={{ color: "red" }}>*</span> Mandatory fields to be filled in.
      </Typography>

      <Grid container spacing={2}>
        {/* LEFT COLUMN */}
        <Grid item xs={12} md={6}>

          <Grid item xs={12} sm={6}>
            <Typography>Change For</Typography>
            <DropDownSelect
              value={changeFor}
              onChange={(e) => setChangeFor(e.target.value)}
              options={changeForOptions}
            />
          </Grid>

          <Grid item>
            <Typography>Domain Name</Typography>

            <DomainAutocomplete
              disabled={!changeFor}
              value={domainName}
              // options={filteredDomains}
              onChange={(e, v) => setDomainName(v)}
              onInputChange={(e, v) => setSearchText(v)}
              getOptionLabel={(o) => o.label || ""}
              sx={{ width: 300 }}
              renderInput={(params) => (
                <TextField {...params} size="small" />
              )}
            />
          </Grid>


          <FormControl fullWidth margin="normal" required>
            <InputLabel id="mod-ba-label">Business Affected</InputLabel>
            <Select
              labelId="mod-ba-label"
              id="ge-modba-input"
              name="Modba"
              value={formData.Modba}
              onChange={handleChange}
            >
              <MenuItem value="0">Select</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            margin="normal"
            id="ge-modpc-input"
            name="Modpc"
            label="Point of contact"
            value={formData.Modpc}
            onChange={handleChange}
            required
          />

          <FormControl component="fieldset" margin="normal" required>
            <Typography variant="body2">
              Is it coordinated change?
            </Typography>
            <RadioGroup
              row
              name="Modcoordinate"
              value={formData.Modcoordinate}
              onChange={handleChange}
            >
              <FormControlLabel value="yes" control={<Radio />} label="Yes" />
              <FormControlLabel value="no" control={<Radio />} label="No" />
            </RadioGroup>
          </FormControl>

          <FormControl component="fieldset" margin="normal" required>
            <Typography variant="body2">
              Is it part of Server/Site migration Activity?
            </Typography>
            <RadioGroup
              row
              name="Modmigration"
              value={formData.Modmigration}
              onChange={handleChange}
            >
              <FormControlLabel value="yes" control={<Radio />} label="Yes" />
              <FormControlLabel value="no" control={<Radio />} label="No" />
            </RadioGroup>
          </FormControl>
        </Grid>

        {/* RIGHT COLUMN */}
        <Grid item xs={12} md={6}>
          <FormControl fullWidth margin="normal" required>
            <InputLabel id="mod-bi-label">Business Impact</InputLabel>
            <Select
              labelId="mod-bi-label"
              id="ge-modbi-input"
              name="Modbi"
              value={formData.Modbi}
              onChange={handleChange}
            >
              <MenuItem value="0">Select</MenuItem>
              <MenuItem value="High">High</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="Low">Low</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal" required>
            <InputLabel id="mod-reason-label">Reason</InputLabel>
            <Select
              labelId="mod-reason-label"
              id="ge-modreason-input"
              name="reasonMod"
              value={formData.reasonMod}
              onChange={handleChange}
            >
              <MenuItem value="0">Select</MenuItem>
              {/* Populate dynamically */}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            margin="normal"
            id="ge-modjusti-input"
            name="justiMod"
            label="Justification"
            value={formData.justiMod}
            onChange={handleChange}
            required
          />

          <FormControl component="fieldset" margin="normal" required>
            <Typography variant="body2">Will it cause an outage?</Typography>
            <RadioGroup
              row
              name="Modoutage"
              value={formData.Modoutage}
              onChange={handleChange}
            >
              <FormControlLabel value="yes" control={<Radio />} label="Yes" />
              <FormControlLabel value="no" control={<Radio />} label="No" />
            </RadioGroup>
          </FormControl>

          <FormControlLabel
            control={
              <Checkbox
                name="disclaimerMod"
                checked={formData.disclaimerMod}
                onChange={handleChange}
              />
            }
            label="By using this site, you agree to abide by our Terms Of Use"
          />
        </Grid>
      </Grid>

      <Box mt={3} textAlign="right">
        <Button variant="contained" color="primary" type="submit">
          Submit
        </Button>
      </Box>
    </Box>
  );
}



// import React, { useState, useMemo, useEffect } from "react";
// import {
//   Box,
//   Grid,
//   TextField,
//   Select,
//   MenuItem,
//   InputLabel,
//   FormControl,
//   FormControlLabel,
//   RadioGroup,
//   Radio,
//   Checkbox,
//   Button,
//   Typography,
// } from "@mui/material";
// import DropDownSelect from "./Form/DropdownSelect";
// import DomainAutocomplete from "./Form/DomainAutocomplete";
// import { useDispatch, useSelector } from "react-redux";
// // import { setField, resetForm } from "../redux/dnsFormSlice";

// export default function EditDnsPage() {
//   const formName = "EditDnsForm"; // you can switch for Add/Edit forms
//   const dispatch = useDispatch();
//   const formData = useSelector((state) => state.dnsForm[formName]);

//   // Local state for autocomplete search
//   const [searchText, setSearchText] = useState("");

//   // Example: options from API or redux
//   const changeForOptions = [
//     { value: "1", label: "Internal DNS" },
//     { value: "2", label: "External DNS" },
//   ];

//   const businessOptions = useMemo(
//     () => [{ value: "1", label: "Business A" }, { value: "2", label: "Business B" }],
//     []
//   );

//   const reasonOptions = useMemo(
//     () => [{ value: "1", label: "Reason A" }, { value: "2", label: "Reason B" }],
//     []
//   );

//   const recordTypeOptions = useMemo(
//     () => [{ value: "A", label: "A" }, { value: "CNAME", label: "CNAME" }],
//     []
//   );

//   const domainOptions = useMemo(
//     () => [{ label: "domain1.com", value: "domain1.com" }, { label: "domain2.com", value: "domain2.com" }],
//     []
//   );

//   const handleChange = (field, value) => {
//     dispatch(setField({ formName, field, value }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log("Submit formData:", formData);
//     // Call API here
//   };

//   return (
//     <Box component="form" onSubmit={handleSubmit} sx={{ p: 3 }}>
//       <Typography variant="body2" color="info.main" gutterBottom>
//         <span style={{ color: "red" }}>*</span> Mandatory fields to be filled in.
//       </Typography>

//       <Grid container spacing={2}>
//         {/* LEFT COLUMN */}
//         <Grid item xs={12} md={6}>
//           <DropDownSelect
//             value={formData.ModChangeFor || ""}
//             onChange={(e) => handleChange("ModChangeFor", e.target.value)}
//             options={changeForOptions}
//           />

//           <DomainAutocomplete
//             value={formData.zone || null}
//             onChange={(e, v) => handleChange("zone", v)}
//             onInputChange={(e, v) => setSearchText(v)}
//             options={domainOptions.filter((d) =>
//               d.label.toLowerCase().includes(searchText.toLowerCase())
//             )}
//             getOptionLabel={(o) => o.label || ""}
//             sx={{ width: 300, mt: 2 }}
//             disabled={!formData.ModChangeFor}
//           />

//           <FormControl fullWidth margin="normal">
//             <InputLabel>Business Affected</InputLabel>
//             <Select
//               value={formData.Modba || ""}
//               onChange={(e) => handleChange("Modba", e.target.value)}
//             >
//               {businessOptions.map((b) => (
//                 <MenuItem key={b.value} value={b.value}>
//                   {b.label}
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormControl>

//           <TextField
//             fullWidth
//             margin="normal"
//             label="Point of contact"
//             value={formData.Modpc || ""}
//             onChange={(e) => handleChange("Modpc", e.target.value)}
//           />

//           <FormControl component="fieldset" margin="normal">
//             <Typography variant="body2">Is it coordinated change?</Typography>
//             <RadioGroup
//               row
//               value={formData.Modcoordinate || "no"}
//               onChange={(e) => handleChange("Modcoordinate", e.target.value)}
//             >
//               <FormControlLabel value="yes" control={<Radio />} label="Yes" />
//               <FormControlLabel value="no" control={<Radio />} label="No" />
//             </RadioGroup>
//           </FormControl>

//           <FormControl component="fieldset" margin="normal">
//             <Typography variant="body2">
//               Is it part of Server/Site migration Activity?
//             </Typography>
//             <RadioGroup
//               row
//               value={formData.Modmigration || "no"}
//               onChange={(e) => handleChange("Modmigration", e.target.value)}
//             >
//               <FormControlLabel value="yes" control={<Radio />} label="Yes" />
//               <FormControlLabel value="no" control={<Radio />} label="No" />
//             </RadioGroup>
//           </FormControl>
//         </Grid>

//         {/* RIGHT COLUMN */}
//         <Grid item xs={12} md={6}>
//           <FormControl fullWidth margin="normal">
//             <InputLabel>Business Impact</InputLabel>
//             <Select
//               value={formData.Modbi || ""}
//               onChange={(e) => handleChange("Modbi", e.target.value)}
//             >
//               <MenuItem value="High">High</MenuItem>
//               <MenuItem value="Medium">Medium</MenuItem>
//               <MenuItem value="Low">Low</MenuItem>
//             </Select>
//           </FormControl>

//           <FormControl fullWidth margin="normal">
//             <InputLabel>Reason</InputLabel>
//             <Select
//               value={formData.reasonMod || ""}
//               onChange={(e) => handleChange("reasonMod", e.target.value)}
//             >
//               {reasonOptions.map((r) => (
//                 <MenuItem key={r.value} value={r.value}>
//                   {r.label}
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormControl>

//           <TextField
//             fullWidth
//             margin="normal"
//             label="Justification"
//             value={formData.justiMod || ""}
//             onChange={(e) => handleChange("justiMod", e.target.value)}
//           />

//           <FormControl component="fieldset" margin="normal">
//             <Typography variant="body2">Will it cause an outage?</Typography>
//             <RadioGroup
//               row
//               value={formData.Modoutage || "no"}
//               onChange={(e) => handleChange("Modoutage", e.target.value)}
//             >
//               <FormControlLabel value="yes" control={<Radio />} label="Yes" />
//               <FormControlLabel value="no" control={<Radio />} label="No" />
//             </RadioGroup>
//           </FormControl>

//           <FormControlLabel
//             control={
//               <Checkbox
//                 checked={formData.disclaimerMod || false}
//                 onChange={(e) => handleChange("disclaimerMod", e.target.checked)}
//               />
//             }
//             label="By using this site, you agree to abide by our Terms Of Use"
//           />

//           <FormControl fullWidth margin="normal">
//             <InputLabel>Record Type</InputLabel>
//             <Select
//               value={formData.ModreqTypemod || ""}
//               onChange={(e) => handleChange("ModreqTypemod", e.target.value)}
//             >
//               {recordTypeOptions.map((r) => (
//                 <MenuItem key={r.value} value={r.value}>
//                   {r.label}
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormControl>

//           <TextField
//             fullWidth
//             margin="normal"
//             label="Existing Record Name"
//             value={formData.sname || ""}
//             onChange={(e) => handleChange("sname", e.target.value)}
//           />

//           <TextField
//             fullWidth
//             margin="normal"
//             label="Existing IP"
//             value={formData.ipv4addr || ""}
//             onChange={(e) => handleChange("ipv4addr", e.target.value)}
//             disabled
//           />

//           <TextField
//             fullWidth
//             margin="normal"
//             label="Edit Record Name"
//             value={formData.newSname || ""}
//             onChange={(e) => handleChange("newSname", e.target.value)}
//           />

//           <TextField
//             fullWidth
//             margin="normal"
//             label="Edit New IP"
//             value={formData.ipv4addrmod || ""}
//             onChange={(e) => handleChange("ipv4addrmod", e.target.value)}
//           />
//         </Grid>
//       </Grid>

//       <Box mt={3} textAlign="right">
//         <Button variant="contained" color="primary" type="submit">
//           Submit
//         </Button>
//       </Box>
//     </Box>
//   );
// }
