import React from "react";
import { Autocomplete, TextField } from "@mui/material";

export default function DomainAutocomplete({ value, options, onChange, onInputChange, disabled }) {
  return (
    <Autocomplete
      disabled={disabled}
      value={value}
      options={options}
      getOptionLabel={(o) => o.label || ""}
      onChange={onChange}
      onInputChange={onInputChange}
      sx={{ width: 300 }}
      renderInput={(params) => <TextField {...params} size="small" />}
    />
  );
}
