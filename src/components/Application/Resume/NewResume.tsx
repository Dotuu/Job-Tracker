import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Resume } from "@/lib/types";
import { FileUpIcon } from "lucide-react";
import { useState } from "react";
import { ResumeForm } from "./ResumeForm";

interface NewResumeProps {
  submitResume: (resume: Resume) => void;
}

export const NewResume = ({ submitResume }: NewResumeProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="ghost" size="sm" className="nav_action_btn">
            <FileUpIcon />
            New Resume
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload new Resume (PDF only)</DialogTitle>
        </DialogHeader>

        <ResumeForm submitResume={submitResume} />
      </DialogContent>
    </Dialog>
  );
};
