import React, { useEffect, useState, useMemo } from "react";
import {
  Box,
  Card,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  Typography,
  CircularProgress,
  Button,
  TextField,
  Stack,
  Link,
} from "@mui/material";
import PageHeader from "../../components/PageHeader";

// Dummy fetch functions – replace with real API calls
const fetchPendingApprovals = async () => {
  return [];
};

const fetchNonPendingApprovals = async () => {
  return [];
};

export default function MyApprovals() {
  const [pending, setPending] = useState([]);
  const [nonPending, setNonPending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");

  const snowUiUrl = "YOUR_SNOW_UI_URL_HERE"; // include SNOW_TICKET_ID

  useEffect(() => {
    const loadApprovals = async () => {
      setLoading(true);
      const pendingData = await fetchPendingApprovals();
      const nonPendingData = await fetchNonPendingApprovals();
      setPending(pendingData);
      setNonPending(nonPendingData);
      setLoading(false);
    };

    loadApprovals();
  }, []);

  const allData = useMemo(() => {
    return [
      ...pending.map((item) => ({ ...item, is_pending: true })),
      ...nonPending.filter(
        (item) =>
          ["implemented", "rejected", "canceled", "approved"].includes(
            item.state?.toLowerCase()
          ) ||
          (["open", "scheduled"].includes(item.state?.toLowerCase()) &&
            item.is_clicked === 1)
      ),
    ];
  }, [pending, nonPending]);

  const filteredData = useMemo(() => {
    return allData.filter(
      (row) =>
        row.chg_ref?.toLowerCase().includes(searchText.toLowerCase()) ||
        row.created_by?.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [allData, searchText]);

  if (loading) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Card sx={{ mb: 3 }}>
        <PageHeader title="My Approvals" />
      </Card>

      <TextField
        label="Search by Ticket or SSO"
        size="small"
        fullWidth
        sx={{ mb: 2 }}
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead sx={{ bgcolor: "#f5f5f5" }}>
            <TableRow>
              <TableCell>Ticket No.</TableCell>
              <TableCell>SSO</TableCell>
              <TableCell>DNS Type</TableCell>
              <TableCell>State</TableCell>
              <TableCell>Zone</TableCell>
              <TableCell>Record Type</TableCell>
              <TableCell>Change Type</TableCell>
              <TableCell>Created On</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  No approvals found
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>
                    <Link
                      href={snowUiUrl.replace("SNOW_TICKET_ID", row.chg_ref)}
                      target="_blank"
                      rel="noreferrer"
                      underline="hover"
                    >
                      {row.chg_ref}
                    </Link>
                  </TableCell>

                  <TableCell>{row.created_by}</TableCell>
                  <TableCell>
                    {row.chg_for === 1 ? "INTERNAL" : "EXTERNAL"}
                  </TableCell>
                  <TableCell>{row.state?.toUpperCase()}</TableCell>
                  <TableCell>{row.zone}</TableCell>
                  <TableCell>{row.rec_type?.toUpperCase()}</TableCell>
                  <TableCell>{row.chg_type?.toUpperCase()}</TableCell>
                  <TableCell>{row.created_at}</TableCell>

                  <TableCell>
                    {row.action_taken?.toLowerCase().includes("approved:") ? (
                      <Typography variant="body2" color="success.main">
                        Approved – No Action Required
                      </Typography>
                    ) : row.action_taken
                        ?.toLowerCase()
                        .includes("rejected:") ? (
                      <Typography variant="body2" color="error.main">
                        Rejected – No Action Required
                      </Typography>
                    ) : row.is_pending ? (
                      <Stack direction="row" spacing={1}>
                        <Button
                          size="small"
                          variant="contained"
                          color="success"
                          href={`/approve/${row.id}`}
                          target="_blank"
                        >
                          Approve
                        </Button>
                        <Button
                          size="small"
                          variant="contained"
                          color="error"
                          href={`/reject/${row.id}`}
                          target="_blank"
                        >
                          Reject
                        </Button>
                      </Stack>
                    ) : (
                      <Typography variant="body2">
                        No Action Required
                      </Typography>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
