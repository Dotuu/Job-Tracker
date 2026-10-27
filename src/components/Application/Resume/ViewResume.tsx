import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { JobApplication, Resume } from "@/lib/types";
import { Eye } from "lucide-react";
import { useState } from "react";
import { ResumeTable } from "./ResumeTable";

interface ViewResumeProps {
  resumes: Resume[];
  applications: JobApplication[];
  onRename: (id: number, fileName: string) => void;
  onDelete: (id: number) => void;
  onSetDefault: (id: number) => void;
  onUnlinkResume: (applicationId: number) => void;
}

export const ViewResume = ({
  resumes,
  applications,
  onRename,
  onDelete,
  onSetDefault,
  onUnlinkResume,
}: ViewResumeProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="ghost" size="sm" className="nav_action_btn">
            <Eye />
            View Resume(s)
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>All resumes</DialogTitle>
          <DialogDescription>
            View, Edit, and Delete resume(s) here.
          </DialogDescription>
        </DialogHeader>

        <ResumeTable
          resumes={resumes}
          applications={applications}
          onRename={onRename}
          onDelete={onDelete}
          onSetDefault={onSetDefault}
          onUnlinkResume={onUnlinkResume}
        />
      </DialogContent>
    </Dialog>
  );
};
