import { Box, Paper, Typography, useTheme, useMediaQuery } from "@mui/material";
import { useState, useEffect } from "react";
import { change_requests } from "../../services/changeRequests.service";
import { ticket_count } from "../../services/changeRequests.service";


const MyRequest = () => {


  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));
  const isSm = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isMd = useMediaQuery(theme.breakpoints.between("md", "lg"));
  const [changeRequests, setChangeRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [counts, setCounts] = useState({
    Open: 0,
    Approved: 0,
    Scheduled: 0,
    Implemented: 0,
    Rejected: 0,
    Cancelled: 0,
  });
  const [totalRequests, setTotalRequests] = useState(0);


  useEffect(() => {


    const fetchTicketCount = async () => {
      setLoading(true);
      try {
        const res = await ticket_count({});
        const data = res?.data?.tickets || {};

        // map backend keys to frontend labels
        setCounts({
          Open: data.open || 0,
          Approved: data.approved || 0,
          Scheduled: data.scheduled || 0,
          Implemented: data.implemented || 0,
          Rejected: data.rejected || 0,
          Cancelled: data.cancelled || 0,
        });

      } catch (err) {
        console.error("Ticket API error:", err);
        setError("Failed to load ticket counts");
      } finally {
        setLoading(false);
      }
    };

    const fetchChangeRequest = async () => {
      setLoading(true);
      try {
        const res = await change_requests({});        
        const data = res?.data?.changes || [];
        console.log(data,'==+++++');
        
        setChangeRequests(data);
        const total = res?.data?.pagination?.total || 0;        
        setTotalRequests(total);
      } catch (err) {
        console.error("Ticket API error:", err);
        setError("Failed to load ticket counts");
      } finally {
        setLoading(false);
      }
    };

    fetchChangeRequest();
    fetchTicketCount();
  }, []);

  // Calculate counts dynamically
  const stats = [
    { label: "Open", count: counts.Open, color: "#f3f307", icon: "fa-certificate" },
    { label: "Approved", count: counts.Approved, color: "#F39C12", icon: "fa-check" },
    { label: "Scheduled", count: counts.Scheduled, color: "#6495ed", icon: "fa-hourglass" },
    { label: "Implemented", count: counts.Implemented, color: "#2ddb4a", icon: "fa-thumbs-up" },
    { label: "Rejected", count: counts.Rejected, color: "#000", icon: "fa-thumbs-down" },
    { label: "Cancelled", count: counts.Cancelled, color: "#ef0000", icon: "fa-ban" },
  ];

  const getStatusColor = (state) => {
    switch (state?.toLowerCase()) {
      case "open":
        return "#f3f307";
      case "approved":
        return "#F39C12";
      case "scheduled":
        return "#6495ed";
      case "implemented":
        return "#2ddb4a";
      case "rejected":
        return "#000";
      case "cancelled":
        return "#ef0000";
      default:
        return "#ccc";
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // months are 0-based
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  let columns = 6;
  if (isMd) columns = 4;
  if (isSm) columns = 2;
  if (isXs) columns = 1;

  return (
    <main className="pt-3">

      {/* ===== Ticket States ===== */}
      <Box
        display="grid"
        gridTemplateColumns={`repeat(${columns}, 1fr)`}
        gap={2}
        mb={3}
      >
        {stats.map((item) => (
          <Paper
            key={item.label}
            sx={{
              border: "1px solid #ccc",
              borderTop: `6px solid ${item.color}`,
              p: 2,
              height: "150px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <Box textAlign="end" sx={{ opacity: 0.15 }}>
              <i className={`fa ${item.icon} fa-2x`} />
            </Box>

            <Box textAlign="center">
              <Typography variant="h5">{item.count}</Typography>
              <Typography fontWeight={600}>{item.label}</Typography>
            </Box>
          </Paper>
        ))}
      </Box>

      {/* ===== Change Requests Header ===== */}
      <Paper
        sx={{
          mb: 3,
          p: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#00003d",
          color: "#fff",
        }}
      >
        <Typography
          variant="h6"
          sx={{ display: "flex", alignItems: "center", gap: 1 }}
        >
          <i className="fas fa-ticket-alt" style={{ transform: "rotate(-45deg)" }} />
          Change Requests
        </Typography>

        <Box display="flex" gap={1} alignItems="center">
          <Typography>Total</Typography>
          <Typography fontWeight={600}>{totalRequests}</Typography>
        </Box>
      </Paper>

      {/* ===== Empty List ===== */}
      {/* <Paper
        sx={{
          p: 2,
          textAlign: "center",
          color: "gray",
          mb: 3,
        }}
      >
        List is Empty
      </Paper> */}

      {changeRequests.length === 0 && !loading && (
        <Paper sx={{ p: 4, textAlign: "center", mb: 3 }}>
          List is Empty!
        </Paper>
      )}

      {changeRequests.length > 0 && (
        <Paper sx={{ mb: 3, overflowX: "auto" }}>
          <table className="table table-hover" id="req_table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Request No.</th>
                <th>Record Type</th>
                <th>Change Type</th>
                <th>Status</th>
                <th>Created On</th>
                <th>Last Modified</th>
              </tr>
            </thead>

            {/* <tbody>
              {changeRequests.map((chg) => (
                <tr
                  key={chg.id}
                  className="change_req"
                  data-chg-no={chg.chg_ref}
                >
                  <td>{chg.id}</td>
                  <td>
                    <a
                      href={chg.snow_ui_url?.replace("SNOW_TICKET_ID", chg.chg_ref)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {chg.chg_ref}
                    </a>
                  </td>
                  <td>{chg.rec_type?.toUpperCase() || ""}</td>
                  <td>
                    <span className="badge text-bg-light">
                      {chg.chg_type?.toUpperCase() || ""}
                    </span>
                  </td>
                  <td>
                    <i
                      className={`fa fa-square state-${chg.state}`}
                      title={chg.state?.toUpperCase()}
                    ></i>
                  </td>
                  <td>{chg.created_at}</td>
                  <td>{chg.modified_at || (chg.is_clicked === 1 ? "-" : "Pending")}</td>
                </tr>
              ))}
            </tbody> */}

            <tbody>
              {changeRequests.map((chg) => (
                <tr key={chg.id}>
                  <td>{chg.id}</td>
                  <td>
                    <a
                      href={chg.snow_ui_url?.replace("SNOW_TICKET_ID", chg.chg_ref)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {chg.chg_ref}
                    </a>
                  </td>
                  <td>{chg.rec_type?.toUpperCase() || ""}</td>
                  <td>{chg.chg_type?.toUpperCase() || ""}</td>
                  <td>
                    <i
                      className="fa fa-square"
                      title={chg.state?.toUpperCase()}
                      style={{ color: getStatusColor(chg.state) }}
                    ></i>
                  </td>
                  <td>{formatDateTime(chg.created_at)}</td>
                  <td>{formatDateTime(chg.modified_at) || (chg.is_clicked === 1 ? "-" : "Pending")}</td>
                </tr>
              ))}
            </tbody>

          </table>
        </Paper>
      )}



    </main>
  );
};

export default MyRequest;




