import { Dialog, DialogTitle, DialogContent, TextField, Button } from "@mui/material";

export default function ExternalHostModal({ open, onClose }) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Create External Host</DialogTitle>
      <DialogContent>
        <TextField label="External Hostname" fullWidth />
        <Button sx={{ mt: 2 }} variant="contained">
          Save
        </Button>
      </DialogContent>
    </Dialog>
  );
}
