import { Container, Stack } from "@mui/material";
import PageHeader from "../../components/PageHeader";
import IpamInstructionsCard from "../../components/Ipam/IpamInstructionsCard";
import IpReservationCard from "../../components/Ipam/StaticIpReservationCard";


export default function IpReservationPage(params) {
    return (
        <Stack spacing={1} sx={{ width: "100%" }}>
            <PageHeader title="IP Reservations" />
            <IpamInstructionsCard />
            <IpReservationCard />
        </Stack>
    )
}