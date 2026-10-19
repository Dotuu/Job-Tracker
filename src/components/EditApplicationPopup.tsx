import type { JobApplication, NewApplicationProps } from "@/lib/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { ApplicationForm } from "./Application/Form/ApplicationForm";
import { useAuthToken } from "@/hooks/use-api";
import { updateApplication } from "@/lib/api";

interface EditApplicationProps {
  application: JobApplication;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdated: (application: JobApplication) => void;
}

export const EditApplicationPopup = ({
  application,
  open,
  onOpenChange,
  onUpdated,
}: EditApplicationProps) => {
  const getAuthToken = useAuthToken();

  const handleSubmit = async (data: NewApplicationProps) => {
    const token = await getAuthToken();
    const updated = await updateApplication(token, application.id, data);
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
        />
      </DialogContent>
    </Dialog>
  );
};
