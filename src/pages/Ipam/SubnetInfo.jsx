import { Container, Stack } from "@mui/material";
import PageHeader from "../../components/PageHeader";
import SubnetInfoCard from "../../components/Ipam/SubnetInfoCard";

export default function SubnetInfoPage(params) {
    return (
        <Stack spacing={1} sx={{ width: "100%" }}>
            <PageHeader title="Subnet Info" />
            <SubnetInfoCard />
        </Stack>
    )
}