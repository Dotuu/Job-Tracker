import type { JobApplication, NewApplicationProps, Resume } from "@/lib/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { ApplicationForm } from "./Application/Form/ApplicationForm";
import { useAuthToken } from "@/hooks/use-api";
import { updateApplication, updateApplicationResume } from "@/lib/api";

interface EditApplicationProps {
  application: JobApplication;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdated: (application: JobApplication) => void;
  resumes: Resume[];
}

export const EditApplicationPopup = ({
  application,
  open,
  onOpenChange,
  onUpdated,
  resumes,
}: EditApplicationProps) => {
  const getAuthToken = useAuthToken();

  const handleSubmit = async (data: NewApplicationProps) => {
    const token = await getAuthToken();
    let updated = await updateApplication(token, application.id, data);
    if (data.resumeId !== application.resumeId) {
      updated = await updateApplicationResume(
        token,
        application.id,
        data.resumeId ?? null,
      );
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
        />
      </DialogContent>
    </Dialog>
  );
};
