import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Alert,
  List,
  ListItem,
  ListItemText,
  Stack,
  Link,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

const IpamTechnicalNotesCard = () => {
  return (
    <Box>
      <Card sx={{ mb: 1 }}>
        <CardContent sx={{ py: 1, "&:last-child": { pb: 1 } }}>
          <Stack spacing={1}>

            {/* Technical Terms */}
            <Alert severity="info" sx={{ fontSize: "0.8rem" }}>
              <Stack spacing={0.5}>
                <Stack direction="row" spacing={1} alignItems="center">
                  {/* <InfoIcon fontSize="small" color="primary" /> */}
                  <Typography variant="subtitle2">
                    Technical Terms
                  </Typography>
                </Stack>

                <List
                  disablePadding
                  sx={{
                    listStyleType: "disc",
                    pl: 2,
                    "& li::marker": { fontSize: "0.8rem" },
                  }}
                >
                  {[
                    "IP or Static IP: A unique address assigned to the network interface that identifies a device on the network.",
                    "DHCP IP: Dynamic IP assigned to a device from a DHCP Range / Pool.",
                    "DHCP Range: Set of IP Addresses that gets dynamically assigned to devices on the network.",
                    "Static IP Reservation: Assigning a hostname / FQDN to an IP address for documentation (e.g., Router, Switch, Server).",
                    "DHCP IP Reservation: Pre-set IP address to a specific device based on its physical MAC address (e.g., Printer, Scanner).",
                  ].map((text, index) => (
                    <ListItem key={index} sx={{ display: "list-item", py: 0 }}>
                      <ListItemText
                        primary={text}
                        primaryTypographyProps={{ fontSize: "0.8rem" }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Stack>
            </Alert>

            {/* Info Note */}
            <Alert severity="info" sx={{ fontSize: "0.8rem" }}>
              <Typography variant="body2" sx={{ fontSize: "0.8rem" }}>
                <span style={{ color: "red" }}>*</span> If you are unable to find
                information through location code, kindly input the Subnet/IP
                address.
                <br />
                <span style={{ color: "red" }}>*</span> If the relevant
                information is not displayed, kindly raise request on{" "}
                <Link
                  href="https://geit.service-now.com"
                  target="_blank"
                  rel="noopener"
                >
                  ServiceNow
                </Link>.
              </Typography>
            </Alert>

            {/* Warning Note */}
            <Alert severity="warning" sx={{ fontSize: "0.8rem" }}>
              <Stack direction="row" spacing={1} alignItems="flex-start">
                {/* <WarningAmberIcon fontSize="small" /> */}
                <Typography variant="body2" sx={{ fontSize: "0.8rem" }}>
                  <strong>NOTE:</strong> Reservation for 3.X IP addresses will
                  undergo approval by the DDI team as GE has migrated to the 10.X
                  IP address segment.
                  <br />
                  For 3.X subnets, new IPs will be reserved only if:
                  <br />
                  1) Subnet exists in DC and 10.X equivalent is not available.
                  <br />
                  2) The site does not have 10.X available.
                </Typography>
              </Stack>
            </Alert>

          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};

export default IpamTechnicalNotesCard;
