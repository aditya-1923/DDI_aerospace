import React from "react";
import { FormControl, InputLabel, Select, MenuItem, TextField, Autocomplete } from "@mui/material";
// import {DropDownSelect} from "../form/index";
import {DropDownSelect} from "./DropdownSelect"

export default function FormField({
  type = "text", // 'text', 'dropdown', 'autocomplete'
  label,
  value,
  onChange,
  options = [],
  width = 300,
  size = "small",
  disabled = false,
  placeholder = "",
  getOptionLabel,
  onInputChange, // only for autocomplete
}) {
  return (
    <FormControl sx={{ minWidth: width }} size={size} disabled={disabled}>
      {label && <InputLabel>{label}</InputLabel>}

      {type === "text" && (
        <TextField
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          size={size}
          fullWidth
        />
      )}

      {type === "dropdown" && (
        <DropDownSelect
          value={value}
          onChange={onChange}
          options={options}
          width={width}
          size={size}
        />
      )}

      {type === "autocomplete" && (
        <Autocomplete
          value={value}
          options={options}
          onChange={onChange}
          onInputChange={onInputChange}
          getOptionLabel={getOptionLabel || ((option) => option.label || "")}
          sx={{ width: width }}
          renderInput={(params) => <TextField {...params} size={size} placeholder={placeholder} />}
          disabled={disabled}
        />
      )}
    </FormControl>
  );
}
