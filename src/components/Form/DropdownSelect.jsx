import React from "react";
import { FormControl, Select, MenuItem } from "@mui/material";

export default function DropDownSelect({ value, onChange, options, width = 200, size = "small" }) {
  const menuProps = {
    PaperProps: {
      style: {
        width: width,
      },
    },
  };

  return (
    <FormControl size={size} sx={{ minWidth: width }}>
      <Select value={value} onChange={onChange} displayEmpty MenuProps={menuProps}>
        <MenuItem value="" disabled>Select</MenuItem>
        {options.map((opt) => (
          <MenuItem key={opt.value || opt.business_name} value={opt.value || opt.business_name}>
            {opt.label || opt.business_name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
