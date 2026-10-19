import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { useState } from "react";

interface ApplicationNotesMenuProps {
  companyName: string;
  roleTitle: string;
  notes?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNotesUpdate: (notes: string) => void;
}

export const ApplicationNotesMenu = ({
  companyName,
  roleTitle,
  notes,
  open,
  onOpenChange,
  onNotesUpdate,
}: ApplicationNotesMenuProps) => {
  const [draft, setDraft] = useState(notes ?? "");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Notes</DialogTitle>
          <DialogDescription>
            {companyName} — {roleTitle}
          </DialogDescription>
        </DialogHeader>
        <Textarea
          ref={(el) => {
            if (!el) return;
            const end = el.value.length;
            el.setSelectionRange(end, end);
            el.scrollTop = el.scrollHeight;
          }}
          defaultValue={notes}
          className="min-h-48"
          onChange={(e) => setDraft(e.target.value)}
        />
        <DialogFooter>
          <Button onClick={(e) => onNotesUpdate(draft)}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
