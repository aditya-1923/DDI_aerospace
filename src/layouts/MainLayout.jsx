import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar/Sidebar";
import Header from "../components/Header/Header";
import { Box } from "@mui/material";

export default function MainLayout() {
  const location = useLocation();
  const noSidebarRoutes = ["/", "/home"];
  const showSidebar = !noSidebarRoutes.includes(location.pathname);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      {/* Header */}
      <Header />

      {/* Body */}
      <Box sx={{ display: "flex", flexGrow: 1, overflow: "hidden" }}>
        {/* Sidebar */}
        {showSidebar && (
          <Box
            sx={{
              width: 260,
              flexShrink: 0,
              borderRight: "1px solid #ddd",
              display: "flex",
              flexDirection: "column",
              overflowY: "auto", // scroll inside sidebar only
              bgcolor: "#fff",
            }}
          >
            <Sidebar />
          </Box>
        )}

        {/* Main content */}
        <Box
          sx={{
            flexGrow: 1,
            p: 2,
            bgcolor: "#f8f9fa",
            overflowY: "auto", // scroll only inside content
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
