import { Container, Stack } from "@mui/material";
import PageHeader from "../../components/PageHeader";
import FeedbackCard from "../../components/ipam/IpamFeedbackCard";

export default function IpamFeedbackPage(params) {
    return (
        <Stack spacing={1} sx={{ width: "100%" }}>
            <PageHeader title="Feedback" />
            <FeedbackCard />
            
        </Stack>
    )
}