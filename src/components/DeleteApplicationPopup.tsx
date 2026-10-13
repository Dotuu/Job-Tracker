import type { DeleteApplicationProps } from "@/lib/types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { deleteApplication } from "@/lib/api";
import { useAuthToken } from "@/hooks/use-api";

export const DeleteApplicationPopup = ({
  applicationId,
  open,
  onOpenChange,
  onClose,
  onDeleted,
}: DeleteApplicationProps) => {
  const getAuthToken = useAuthToken();

  const handleDelete = async () => {
    onClose();
    try {
      const token = await getAuthToken();
      await deleteApplication(token, applicationId);
      onDeleted(applicationId);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this application?</AlertDialogTitle>
          <AlertDialogDescription>This can't be undone.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
