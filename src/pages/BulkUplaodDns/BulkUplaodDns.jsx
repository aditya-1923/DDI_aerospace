import { Container, Stack } from "@mui/material";
import PageHeader from "../../components/PageHeader";
import InstructionsCard from "../../components/InstructionsCard";
import EditDnsPage from "../../components/ModifyDnsFormComponent";

export default function BulkAddDnsPage() {
  return (
      <Stack spacing={1} sx={{ width: "100%"}}>
        <PageHeader title="Bulk Add" />
      </Stack>
  );
}