import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

/* -------------------- IP Helpers -------------------- */

function ipToTuple(ip) {
  if (!ip || typeof ip !== "string") return null;
  const parts = ip.split(".");
  if (parts.length !== 4) return null;
  const nums = parts.map((p) => {
    const n = Number(p);
    return Number.isFinite(n) && n >= 0 && n <= 255 ? n : NaN;
  });
  if (nums.some((n) => Number.isNaN(n))) return null;
  return nums;
}

function compareIp(a, b) {
  const ta = ipToTuple(a);
  const tb = ipToTuple(b);
  if (!ta && !tb) return 0;
  if (!ta) return 1;
  if (!tb) return -1;
  for (let i = 0; i < 4; i++) {
    if (ta[i] !== tb[i]) return ta[i] - tb[i];
  }
  return 0;
}

/* -------------------- Columns -------------------- */

function getColumnsForAction(action) {
  const base = {
    reserve: [
      { key: "select", label: "", width: "2%", sortable: false },
      { key: "ip_address", label: "IP Address", width: "23%", sortable: true, isIp: true },
      { key: "hostname", label: "Hostname", width: "33%", sortable: true, required: true },
      { key: "availability", label: "Availability", width: "20%", sortable: true },
      { key: "ping_status", label: "Ping Status", width: "20%", sortable: true },
      { key: "info", label: "", width: "2%", sortable: false },
    ],
    release: [
      { key: "select", label: "", width: "2%", sortable: false },
      { key: "ip_address", label: "IP Address", width: "10%", sortable: true, isIp: true },
      { key: "fqdn", label: "FQDN", width: "33%", sortable: true },
      { key: "availability", label: "Availability", width: "33%", sortable: true },
      { key: "ping_status", label: "Ping Status", width: "20%", sortable: true },
      { key: "info", label: "", width: "2%", sortable: false },
    ],
    modify: [
      { key: "select", label: "", width: "2%", sortable: false },
      { key: "ip_address", label: "IP Address", width: "16%", sortable: true, isIp: true },
      { key: "existing_record", label: "Existing Record", width: "25%", sortable: true },
      { key: "hostname", label: "Hostname", width: "25%", sortable: true, required: true },
      { key: "availability", label: "Availability", width: "15%", sortable: true },
      { key: "ping_status", label: "Ping Status", width: "15%", sortable: true },
      { key: "info", label: "", width: "2%", sortable: false },
    ],
  };
  return base[action] ?? base.reserve;
}

/* -------------------- Transform Row -------------------- */

function toDisplayRow(raw, action) {
  const status = String(raw.status || "").toLowerCase();
  const used = status === "static";
  const availability =
    used ? "Used" : status === "unassigned" ? "Free" : raw.status || "";

  const base = {
    ip_address: raw.ip_address,
    ping_status: raw.ping_status || "",
    availability,
    used,
    free: availability === "Free",
    names: raw.names || "",
  };

  if (action === "release") {
    return { ...base, fqdn: raw.names || "" };
  }
  if (action === "modify") {
    return {
      ...base,
      existing_record: raw.names || "",
      hostname: "",
    };
  }

  return { ...base, hostname: raw.names || "" };
}

/* ======================================================= */
/* ================== MAIN TABLE ========================= */
/* ======================================================= */

export default function SubnetIpsDataTable({
  rows,
  action,
  allowOperation = true,
  selectedIps,
  setSelectedIps,
  ipFilter, // controlled from header
}) {
  const columns = useMemo(() => getColumnsForAction(action), [action]);

  const displayRows = useMemo(
    () => (rows || []).map((r) => toDisplayRow(r, action)).filter(r => r.ip_address),
    [rows, action]
  );

  /* -------------------- Filters -------------------- */

  const initialFilters = useMemo(() => {
    const obj = {};
    columns.forEach((c) => { if (c.label) obj[c.key] = ""; });
    return obj;
  }, [columns]);

  const [filters, setFilters] = useState(initialFilters);

  useEffect(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  /* -------------------- Sorting -------------------- */

  const [orderBy, setOrderBy] = useState("ip_address");
  const [order, setOrder] = useState("asc");

  const handleSort = (key) => {
    if (orderBy === key) {
      setOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setOrderBy(key);
      setOrder("asc");
    }
  };

  const sortedRows = useMemo(() => {
    const arr = [...displayRows];
    arr.sort((a, b) => {
      const col = columns.find((c) => c.key === orderBy);
      const isIp = col?.isIp;
      let cmp = 0;

      if (isIp) {
        cmp = compareIp(a[orderBy] || "", b[orderBy] || "");
      } else {
        cmp = String(a[orderBy] ?? "")
          .localeCompare(String(b[orderBy] ?? ""), undefined, { sensitivity: "base" });
      }

      return order === "asc" ? cmp : -cmp;
    });
    return arr;
  }, [displayRows, orderBy, order, columns]);

  /* -------------------- Filtering -------------------- */

  const filteredRows = useMemo(() => {
    const availWanted = ipFilter === "free" ? "Free" : "Used";

    return sortedRows.filter((r) => {
      if (r.availability !== availWanted) return false;

      for (const [key, val] of Object.entries(filters)) {
        if (!val) continue;
        if (!String(r[key] ?? "").toLowerCase().includes(val.toLowerCase())) {
          return false;
        }
      }

      return true;
    });
  }, [sortedRows, ipFilter, filters]);

  /* -------------------- Pagination -------------------- */

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    setPage(0);
  }, [ipFilter, filters, action]);

  const pageRows = filteredRows.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  /* -------------------- Selection -------------------- */

  const canSelect = (row) => {
    if (!allowOperation) return false;
    if (action === "reserve" && row.free) return true;
    if (action === "release" && row.used) return true;
    if (action === "modify" && row.used) return true;
    return false;
  };

  const toggleSelect = (ip) => {
    setSelectedIps((prev) =>
      prev.includes(ip) ? prev.filter((x) => x !== ip) : [...prev, ip]
    );
  };

  /* -------------------- Render -------------------- */

  return (
    <Box>
      <TableContainer component={Paper}>
        <Table size="small">

          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <TableCell
                  key={col.key}
                  sx={{ width: col.width }}
                  onClick={() => col.sortable && handleSort(col.key)}
                  style={{ cursor: col.sortable ? "pointer" : "default" }}
                >
                  {col.label}
                  {col.sortable && orderBy === col.key && (
                    <span style={{ marginLeft: 6, fontSize: 12 }}>
                      {order === "asc" ? "▲" : "▼"}
                    </span>
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {pageRows.map((row) => (
              <TableRow key={row.ip_address} hover>
                {columns.map((col) => {
                  if (col.key === "select") {
                    return (
                      <TableCell key="select">
                        {canSelect(row) && (
                          <input
                            type="checkbox"
                            checked={selectedIps.includes(row.ip_address)}
                            onChange={() => toggleSelect(row.ip_address)}
                          />
                        )}
                      </TableCell>
                    );
                  }

                  if (col.key === "availability") {
                    return (
                      <TableCell key="availability">
                        {row.used ? (
                          <Chip label="Used" color="error" size="small" />
                        ) : (
                          <Chip label="Free" color="success" size="small" />
                        )}
                      </TableCell>
                    );
                  }

                  if (col.key === "ip_address") {
                    return (
                      <TableCell key="ip">
                        <strong>{row.ip_address}</strong>
                      </TableCell>
                    );
                  }

                  if (col.key === "ping_status") {
                    return (
                      <TableCell key="ping">
                        {row.ping_status || "-"}
                      </TableCell>
                    );
                  }

                  return (
                    <TableCell key={col.key}>
                      {String(row[col.key] ?? "") || "-"}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}

            {pageRows.length === 0 && (
              <TableRow>
                <TableCell colSpan={columns.length} align="center">
                  No rows to display
                </TableCell>
              </TableRow>
            )}
          </TableBody>

          <TableFooter>
            <TableRow>
              <TablePagination
                count={filteredRows.length}
                page={page}
                onPageChange={(e, p) => setPage(p)}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={(e) => {
                  setRowsPerPage(parseInt(e.target.value, 10));
                  setPage(0);
                }}
                rowsPerPageOptions={[5, 10, 25, 50]}
              />
            </TableRow>
          </TableFooter>

        </Table>
      </TableContainer>
    </Box>
  );
}