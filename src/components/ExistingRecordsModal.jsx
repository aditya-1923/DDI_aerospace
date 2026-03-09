import { Dialog, DialogTitle, DialogContent, Button } from "@mui/material";

export default function ExistingRecordsModal({ open, onClose }) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Existing Records</DialogTitle>
      <DialogContent>
        Existing DNS record found.
        <Button onClick={onClose}>OK</Button>
      </DialogContent>
    </Dialog>
  );
}
