import { TextField } from "@mui/material";

export default function RecordValueField({ type, value, onChange }) {
  if (!type) return null;

  if (type === "PTR")
    return <TextField label="IP Address" value={value} disabled fullWidth />;

  if (type === "TXT")
    return (
      <TextField
        label="TXT Value"
        value={value}
        onChange={onChange}
        multiline
        rows={3}
        fullWidth
      />
    );

  return (
    <TextField
      label={type === "A" ? "IP Address" : "Hostname"}
      value={value}
      onChange={onChange}
      fullWidth
    />
  );
}
