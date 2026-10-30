import type {
  JobApplication,
  NewApplicationProps,
  Resume,
  Tag,
} from "@/lib/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { ApplicationForm } from "./Application/Form/ApplicationForm";
import { useAuthToken } from "@/hooks/use-api";
import {
  updateApplication,
  updateApplicationResume,
  updateApplicationTags,
} from "@/lib/api";

interface EditApplicationProps {
  application: JobApplication;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdated: (application: JobApplication) => void;
  resumes: Resume[];
  tags: Tag[];
}

const sameIds = (a: number[], b: number[]) =>
  a.length === b.length && a.every((id) => b.includes(id));

export const EditApplicationPopup = ({
  application,
  open,
  onOpenChange,
  onUpdated,
  resumes,
  tags,
}: EditApplicationProps) => {
  const getAuthToken = useAuthToken();

  const handleSubmit = async ({ tagIds = [], ...data }: NewApplicationProps) => {
    const token = await getAuthToken();
    let updated = await updateApplication(token, application.id, data);
    if (data.resumeId !== application.resumeId) {
      updated = await updateApplicationResume(
        token,
        application.id,
        data.resumeId ?? null,
      );
    }
    if (!sameIds(tagIds, application.tagIds ?? [])) {
      updated = await updateApplicationTags(token, application.id, tagIds);
    }
    onUpdated(updated);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {`Edit application for ${application.companyName}`}
          </DialogTitle>
        </DialogHeader>
        <ApplicationForm
          key={application.id}
          initialValues={application}
          submitLabel={"Save Changes"}
          onSubmit={handleSubmit}
          resumes={resumes}
          tags={tags}
        />
      </DialogContent>
    </Dialog>
  );
};
