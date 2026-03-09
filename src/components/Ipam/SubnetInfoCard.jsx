import React, { useState } from "react";
import {
  Card,
  CardContent,
  Grid,
  Typography,
  TextField,
  Button,
  Box,
  LinearProgress,
} from "@mui/material";

import { MaterialReactTable, useMaterialReactTable } from "material-react-table";
import { mkConfig, generateCsv, download } from "export-to-csv";
import * as XLSX from "xlsx";
import { subnet_info } from "../../services/ipamIpReservationService";

const ipRegex =
  /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\/([0-9]|[1-2][0-9]|3[0-2]))?$/;

const labelStyle = {
  textAlign: "right",
  pr: 1,
  fontWeight: 500,
};

const SubnetInfoCard = () => {
  const [locationCode, setLocationCode] = useState("");
  const [subnetIp, setSubnetIp] = useState("");
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [subnetError, setSubnetError] = useState("");

  /* ---------- Columns for Subnet Search ---------- */
  const subnetColumns = [
    { accessorKey: "ip", header: "IP Address" },
    { accessorKey: "location_code", header: "Location Code" },
    { accessorKey: "status", header: "Status" },
    { accessorKey: "mac_address", header: "MAC Address" },
    { accessorKey: "record", header: "Record" },
    { accessorKey: "types", header: "Rec Types" },
    { accessorKey: "ip_group", header: "IP Group" },
  ];

  /* ---------- Columns for Location Search ---------- */
  const locationColumns = [
    {
      accessorKey: "subnet",
      header: "Subnet",
      size: 160,
      Cell: ({ cell, row }) =>
        row.original.container === "Yes" ? (
          <span
            style={{
              background: "#6c757d",
              color: "white",
              padding: "3px 6px",
              borderRadius: "4px",
              cursor: "pointer",
            }}
            onClick={() => handleSearch(cell.getValue())}
          >
            {cell.getValue()}
          </span>
        ) : (
          <span
            style={{ color: "#1976d2", cursor: "pointer" }}
            onClick={() => handleSearch(cell.getValue())}
          >
            {cell.getValue()}
          </span>
        ),
    },

    { accessorKey: "container", header: "Container", size: 100 },
    { accessorKey: "view", header: "View", size: 100 },
    { accessorKey: "type", header: "Type", size: 100 },
    { accessorKey: "name", header: "Name", size: 120 },
    { accessorKey: "dhcp_enable", header: "DHCP Enabled", size: 120 },
    { accessorKey: "location_code", header: "Location Code", size: 130 },
    { accessorKey: "site_contact", header: "Site Contact", size: 130 },
    { accessorKey: "business", header: "Business", size: 120 },
    { accessorKey: "country", header: "Country", size: 100 },

    {
      accessorKey: "ipam_utilization",
      header: "IPAM Utilization",
      size: 150,
      Cell: ({ cell }) => {
        const val = cell.getValue() ?? 0;
        let color = val > 80 ? "red" : val > 50 ? "orange" : "green";

        return (
          <Box sx={{ width: "100%" }}>
            <LinearProgress
              variant="determinate"
              value={val}
              sx={{
                height: 10,
                borderRadius: 2,
                backgroundColor: "#eee",
                "& .MuiLinearProgress-bar": { backgroundColor: color },
              }}
            />
            <Typography variant="caption">{val.toFixed(1)}%</Typography>
          </Box>
        );
      },
    },

    {
      accessorKey: "dhcp_utilization",
      header: "DHCP Utilization",
      size: 150,
      Cell: ({ cell }) => {
        const val = cell.getValue() ?? 0;
        let color = val > 80 ? "red" : val > 50 ? "orange" : "green";

        return (
          <Box sx={{ width: "100%" }}>
            <LinearProgress
              variant="determinate"
              value={val}
              sx={{
                height: 10,
                borderRadius: 2,
                backgroundColor: "#eee",
                "& .MuiLinearProgress-bar": { backgroundColor: color },
              }}
            />
            <Typography variant="caption">{val.toFixed(1)}%</Typography>
          </Box>
        );
      },
    },

    { accessorKey: "router", header: "Gateway", size: 120 },
    { accessorKey: "comment", header: "Comment", size: 160 },
    { accessorKey: "discovered_vlan_name", header: "VLAN Name", size: 140 },
    { accessorKey: "vlan", header: "VLAN", size: 80 },
    { accessorKey: "vlan_desc", header: "VLAN Desc", size: 160 },
    { accessorKey: "work_ticket", header: "Work Ticket", size: 140 },
  ];

  /* ---------- CSV Export ---------- */

  const csvConfig = mkConfig({
    filename: "subnet_data",
    fieldSeparator: ",",
    decimalSeparator: ".",
    useKeysAsHeaders: true,
  });

  const exportCsv = () => {
    if (rows.length === 0) return;

    const csv = generateCsv(csvConfig)(rows);
    download(csvConfig)(csv);
  };


  const handleSearch = async (value) => {
    const searchValue = (value ?? subnetIp.trim()) || locationCode.trim();
    if (!searchValue) return;

    try {
      setLoading(true);
      setRows([]);
      setColumns([]);
      setComment("");

      const response = await subnet_info({ sub_or_loc: searchValue });

      const result = response?.data?.result || [];
      const isSuccess = response?.data?.status?.toLowerCase() === "success";

      if (isSuccess && result.length > 0) {
        // Format rows with an id
        const formattedRows = result.map((item, index) => ({ id: index, ...item }));
        setRows(formattedRows);

        if (response.data.is_subnet) {
          setColumns(subnetColumns);
          setComment(response.data.subnet_comment || "");
          setSubnetIp(searchValue);
          setLocationCode("");
        } else {
          setColumns(locationColumns);
          setComment("");
        }
      } else {
        setColumns(searchValue === subnetIp.trim() ? subnetColumns : locationColumns);
        setRows([]);
        setComment("No data available for this selection");
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      // On error, show empty table
      setColumns(searchValue === subnetIp.trim() ? subnetColumns : locationColumns);
      setRows([]);
      setComment("Failed to fetch data. Showing empty table.");
    } finally {
      setLoading(false);
    }
  };
  /* ---------- Excel Export ---------- */
  const exportExcel = () => {
    const rowData = table
      .getFilteredRowModel()
      .rows.map((row) => row.original);

    if (rowData.length === 0) return;

    const ws = XLSX.utils.json_to_sheet(rowData);
    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, "SubnetData");
    XLSX.writeFile(wb, "subnet_data.xlsx");
  };

  const table = useMaterialReactTable({
    columns,
    data: rows,
    state: { isLoading: loading },

    enableColumnFilters: true,
    enablePagination: true,
    enableSorting: true,
    enableTopToolbar: true,
    enableBottomToolbar: true,

    initialState: {
      pagination: { pageSize: 10 },
      columnOrder: columns.map((c) => c.accessorKey),
    },

    renderTopToolbarCustomActions: () => (
      <Box sx={{ display: "flex", gap: 2 }}>
        <Button variant="outlined" onClick={exportCsv}>
          CSV
        </Button>
        <Button variant="outlined" onClick={exportExcel}>
          Excel
        </Button>
      </Box>
    ),

    renderEmptyRowsFallback: () => (
      <Typography textAlign="center" sx={{ p: 2 }}>
        No data available
      </Typography>
    ),
  });

  const handleLocationChange = (value) => {
    setLocationCode(value);
    setSubnetIp("");
    setSubnetError("");

    const lower = value.toLowerCase();

    if (
      value &&
      (value.length < 6 ||
        !(
          lower.startsWith("as-") ||
          lower.startsWith("am-") ||
          lower.startsWith("em-")
        ))
    ) {
      setLocationError(
        "Must start with AS-, AM-, or EM- and be ≥ 6 characters"
      );
    } else {
      setLocationError("");
    }
  };

  const handleSubnetChange = (value) => {
    setSubnetIp(value);
    setLocationCode("");
    setLocationError("");

    if (value && !ipRegex.test(value)) {
      setSubnetError("Enter valid IP or CIDR (192.168.1.0/24)");
    } else {
      setSubnetError("");
    }
  };

  return (
    <Box>
      <Card>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <Grid container spacing={2} alignItems="center" sx={{ mb: 1 }}>
                <Grid size={5}>
                  <Typography sx={labelStyle}>Location Code *</Typography>
                </Grid>
                <Grid size={7}>

                  <TextField
                    fullWidth
                    size="small"
                    value={locationCode}
                    onChange={(e) => handleLocationChange(e.target.value)}
                    placeholder="Enter Location Code"
                    disabled={subnetIp !== "" || loading}
                    error={!!locationError}
                    helperText={locationError}
                  />
                </Grid>
              </Grid>

            </Grid>


            <Grid size={{ sx: 12, md: 6 }}>

              <Grid container spacing={2} alignItems="center" sx={{ mb: 1 }}>
                <Grid size={5}>
                  <Typography sx={labelStyle}>Subnet/IP Address *</Typography>
                </Grid>
                <Grid size={7}>
                  <TextField
                    fullWidth
                    size="small"
                    value={subnetIp}
                    onChange={(e) => handleSubnetChange(e.target.value)}
                    placeholder="Enter Subnet/IP Address"
                    disabled={locationCode !== "" || loading}
                    error={!!subnetError}
                    helperText={subnetError}
                  />

                </Grid>
              </Grid>

            </Grid>


          </Grid>

          <Box mt={3} textAlign="right">
            <Button
              variant="contained"
              disabled={loading || (!locationCode && !subnetIp)}
              onClick={() => handleSearch()}
            >
              {loading ? "Searching..." : "Search"}
            </Button>
          </Box>

          {/* {comment && (
            <Typography mt={2}>
              <strong>Comment:</strong> {comment}
            </Typography>
          )} */}
        </CardContent>
      </Card>

      {rows.length > 0 && (
        <Box mt={3}>
          <MaterialReactTable table={table} />
        </Box>
      )}
    </Box >
  );
};

export default SubnetInfoCard;