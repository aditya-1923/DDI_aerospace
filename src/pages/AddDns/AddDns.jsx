import { Container, Stack } from "@mui/material";
import PageHeader from "../../components/PageHeader";
import InstructionsCard from "../../components/InstructionsCard";
import AddDomainForm from "../../components/AddDomainForm";

export default function AddDomainPage() {
  return (
      <Stack spacing={1} sx={{ width: "100%"}}>
        <PageHeader title="Add Domain Form" />
        <InstructionsCard />
        <AddDomainForm />
      </Stack>
  );
}


