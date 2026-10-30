import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Settings } from "lucide-react";
import { useState } from "react";
import { ManageTagsForm } from "./ManageTagsForm";
import type { TagProps } from "./Tags";

interface ManageTagsProps {
  updateTag: (tag: TagProps) => void | Promise<void>;
  deleteTag: (tagId: number) => void | Promise<void>;
  tags: TagProps[];
}

export const ManageTags = ({ updateTag, deleteTag, tags }: ManageTagsProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="ghost" size="sm" className="nav_action_btn">
            <Settings />
            Manage Tags
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manage Tags</DialogTitle>
          <DialogDescription>
            Rename, recolor, or delete an existing tag.
          </DialogDescription>
        </DialogHeader>
        <ManageTagsForm
          tags={tags}
          updateTag={updateTag}
          deleteTag={deleteTag}
          onDone={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
};
