import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TagPlus } from "lucide-react";
import { useState } from "react";
import { TagForm, type TagFormValues } from "./TagForm";
import type { TagProps } from "./Tags";

interface NewTagProps {
  newTag: (tag: TagProps) => void | Promise<void>;
  tags: TagProps[];
}

export const NewTag = ({ newTag, tags }: NewTagProps) => {
  const [open, setOpen] = useState(false);

  const handleSubmit = async ({ name, colorHex }: TagFormValues) => {
    await newTag({ name, colorHex, scope: "APPLICATION" });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="ghost" size="sm" className="nav_action_btn">
            <TagPlus />
            New Tag
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create new Tag</DialogTitle>
          <DialogDescription>
            Name your tag and pick a color to group applications.
          </DialogDescription>
        </DialogHeader>
        <TagForm
          submitLabel={"Create Tag"}
          onSubmit={handleSubmit}
          existingNames={tags.map((tag) => tag.name)}
        />
      </DialogContent>
    </Dialog>
  );
};
