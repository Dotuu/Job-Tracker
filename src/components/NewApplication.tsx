import { useState } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { ApplicationForm } from "./Application/Form/ApplicationForm";
import type {
  JobApplication,
  NewApplicationProps,
  Resume,
  Tag,
} from "@/lib/types";
import { useAuthToken } from "@/hooks/use-api";
import {
  postApplication,
  updateApplicationResume,
  updateApplicationTags,
} from "@/lib/api";
import { FilePlusIcon } from "lucide-react";

export const NewApplication = ({
  onCreated,
  resumes,
  tags,
}: {
  onCreated: (application: JobApplication) => void;
  resumes: Resume[];
  tags: Tag[];
}) => {
  const [open, setOpen] = useState(false);
  const getAuthToken = useAuthToken();

  const handleSubmit = async ({ tagIds, ...data }: NewApplicationProps) => {
    const token = await getAuthToken();
    let created = await postApplication(token, data);
    if (data.resumeId != null) {
      created = await updateApplicationResume(token, created.id, data.resumeId);
    }
    if (tagIds?.length) {
      created = await updateApplicationTags(token, created.id, tagIds);
    }
    onCreated(created);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="ghost" size="sm" className="nav_action_btn">
            <FilePlusIcon />
            New Application
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create new Application</DialogTitle>
        </DialogHeader>
        <ApplicationForm
          submitLabel={"Create Application"}
          onSubmit={handleSubmit}
          resumes={resumes}
          tags={tags}
        />
      </DialogContent>
    </Dialog>
  );
};
