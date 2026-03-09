import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
  Snackbar,
} from "@mui/material";
import PageHeader from "../../components/PageHeader";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";

const SNOW_UI_URL = "https://snow.example.com/ticket/SNOW_TICKET_ID";

export default function MyIpamRequests() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [cancelOpen, setCancelOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [selectedTicket, setSelectedTicket] = useState(null);

  const [msg, setMsg] = useState("");
  const [showMsg, setShowMsg] = useState(false);

  // 🔹 Fetch table data
  useEffect(() => {
    setLoading(true);
    fetch("/api/ipam/my-requests")
      .then((res) => res.json())
      .then((res) => setData(res))
      .finally(() => setLoading(false));
  }, []);

  
  const columns = useMemo(
    () => [
      {
        accessorKey: "chg_ref",
        header: "Ticket No.",
        Cell: ({ cell }) => (
          <a
            href={SNOW_UI_URL.replace("SNOW_TICKET_ID", cell.getValue())}
            target="_blank"
            rel="noreferrer"
          >
            {cell.getValue()}
          </a>
        ),
      },
      { accessorKey: "chg_type", header: "Change Type" },
      { accessorKey: "rec_type", header: "Record Type" },
      { accessorKey: "created_at", header: "Created On" },
      {
        accessorKey: "state",
        header: "Status",
        Cell: ({ cell }) =>
          cell.getValue()?.toLowerCase() === "implement"
            ? "Implemented"
            : cell.getValue(),
      },
      {
        header: "Action",
        Cell: ({ row }) =>
          row.original.state?.toLowerCase() === "open" ? (
            <Button
              size="small"
              variant="contained"
              color="success"
              onClick={() => {
                setSelectedTicket(row.original);
                setCancelOpen(true);
              }}
            >
              Cancel
            </Button>
          ) : null,
      },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data,
    state: { isLoading: loading },
    enableColumnFilters: true,
    enablePagination: true,
    enableSorting: true,
    enableTopToolbar: true,
    enableBottomToolbar: true,
    initialState: {
      pagination: { pageSize: 10 },
      sorting: [{ id: "created_at", desc: true }],
    },
    enableRowActions: false,
    enableColumnActions: false,
    renderTopToolbarCustomActions: ({ table }) => (
      <Box>
        <Button onClick={() => table.exportData("csv")}>CSV</Button>
        <Button onClick={() => table.exportData("excel")}>Excel</Button>
      </Box>
    ),
  });

  // Cancel submit
  const handleCancelSubmit = async () => {
    if (!cancelReason) return;

    setMsg("Requesting... Please wait");
    setShowMsg(true);

    const res = await fetch("/api/ipam/cancel-request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ticket_num: selectedTicket.chg_ref,
        ticket_id: selectedTicket.id,
        cancel_msg: cancelReason,
      }),
    });

    const response = await res.json();

    setMsg(response.msg);
    setCancelOpen(false);
    setCancelReason("");

    // Refresh table
    setData((prev) =>
      prev.map((r) =>
        r.id === selectedTicket.id
          ? { ...r, state: "Cancelled" }
          : r
      )
    );
  };

  return (
    <Stack spacing={2}>
      <PageHeader title="My Requests" />

      <MaterialReactTable table={table} />

      {/* Cancel Modal */}
      <Dialog open={cancelOpen} onClose={() => setCancelOpen(false)} fullWidth>
        <DialogTitle>
          {selectedTicket?.chg_ref} - Cancel
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Reason for Cancel"
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelOpen(false)}>Close</Button>
          <Button
            variant="contained"
            disabled={!cancelReason}
            onClick={handleCancelSubmit}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      {/* Bottom Message Bar */}
      <Snackbar
        open={showMsg}
        autoHideDuration={4000}
        message={msg}
        onClose={() => setShowMsg(false)}
      />
    </Stack>
  );
}
