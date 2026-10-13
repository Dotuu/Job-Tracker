import { useState } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { ApplicationForm } from "./ApplicationForm";
import type { JobApplication, NewApplicationProps } from "@/lib/types";
import { useAuthToken } from "@/hooks/use-api";
import { postApplication } from "@/lib/api";

export const NewApplication = ({
  onCreated,
}: {
  onCreated: (application: JobApplication) => void;
}) => {
  const [open, setOpen] = useState(false);
  const getAuthToken = useAuthToken();

  const handleSubmit = async (data: NewApplicationProps) => {
    const token = await getAuthToken();
    const created = await postApplication(token, data);
    onCreated(created);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button>New Application</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create new Application</DialogTitle>
        </DialogHeader>
        <ApplicationForm
          submitLabel={"Create Application"}
          onSubmit={handleSubmit}
        />
      </DialogContent>
    </Dialog>
  );
};
