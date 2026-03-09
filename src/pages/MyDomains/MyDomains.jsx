import React, { useState, useMemo } from "react";
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
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import PageHeader from "../../components/PageHeader";
import { my_domain_list } from "../../services/myDomainService";
import { useFetchOnce } from "../../hooks/useFetchOnce";

export default function MyDomains() {
  const [searchText, setSearchText] = useState("");

  // Fetch domains using useFetchOnce
  const { data, loading, error } = useFetchOnce(my_domain_list, [], 2, 1000);

  // Combine internal + external domains
  const combinedDomains = useMemo(() => {
    if (!data) return [];
    return [
      ...(data.internal_domains || []).map((d) => ({ ...d, type: "Internal" })),
      ...(data.external_domains || []).map((d) => ({ ...d, type: "External" })),
    ];
  }, [data]);

  // Filter domains based on search text
  const filteredDomains = useMemo(() => {
    return combinedDomains.filter((d) =>
      d.name?.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [combinedDomains, searchText]);

  if (loading)
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <CircularProgress />
      </Box>
    );

  if (error)
    return (
      <Box sx={{ p: 4 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );

  return (
    <Box sx={{ p: 3 }}>
      <Card sx={{ mb: 3 }}>
        <PageHeader title="My Domains" />
      </Card>

      <TextField
        label="Search Domain"
        variant="outlined"
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
              <TableCell>Domain Name</TableCell>
              <TableCell>Domain Type</TableCell>
              <TableCell>First Approver</TableCell>
              <TableCell>Second Approver</TableCell>
              <TableCell>Third Approver</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredDomains.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No domains found
                </TableCell>
              </TableRow>
            ) : (
              filteredDomains.map((domain, index) => (
                <TableRow key={index}>
                  <TableCell>{domain.name}</TableCell>
                  <TableCell>{domain.type}</TableCell>
                  <TableCell>{domain.first_approver}</TableCell>
                  <TableCell>{domain.second_approver}</TableCell>
                  <TableCell>{domain.third_approver}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
