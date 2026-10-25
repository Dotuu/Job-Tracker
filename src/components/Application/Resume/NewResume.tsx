import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FileUpIcon } from "lucide-react";
import { useState } from "react";
import { ResumeForm } from "./ResumeForm";

interface NewResumeProps {
  submitResume: (file: File, title: string) => Promise<boolean>;
}

export const NewResume = ({ submitResume }: NewResumeProps) => {
  const [open, setOpen] = useState(false);

  const handleSubmit = async (file: File, title: string) => {
    const uploaded = await submitResume(file, title);
    if (uploaded) {
      setOpen(false);
    }
  };

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
          <DialogDescription>
            Name and upload resume, for easy access here.
          </DialogDescription>
        </DialogHeader>

        <ResumeForm submitResume={handleSubmit} />
      </DialogContent>
    </Dialog>
  );
};
