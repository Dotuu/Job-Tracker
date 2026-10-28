import { Button } from "../../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import {
  EllipsisVerticalIcon,
  SquarePenIcon,
  TrashIcon,
  UnlinkIcon,
} from "lucide-react";
import { DeleteApplicationPopup } from "../../DeleteApplicationPopup";
import { EditApplicationPopup } from "../../EditApplicationPopup";
import { useState } from "react";
import type { JobApplication, Resume } from "@/lib/types";

export interface ApplicationTableMenuProps {
  application: JobApplication;
  onDeleted: (id: number) => void;
  onUpdated: (application: JobApplication) => void;
  onUnlinkResume: (applicationId: number) => void;
  resumes: Resume[];
}

export const ApplicationTableMenu = ({
  application,
  onDeleted,
  onUpdated,
  onUnlinkResume,
  resumes,
}: ApplicationTableMenuProps) => {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant="ghost" size="icon" aria-label="Open menu">
              <EllipsisVerticalIcon />
            </Button>
          }
        />
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => setEditOpen(true)}>
            <SquarePenIcon />
            Edit
          </DropdownMenuItem>
          {application.resumeId != null && (
            <DropdownMenuItem onClick={() => onUnlinkResume(application.id)}>
              <UnlinkIcon />
              Unlink resume
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={() => setDeleteOpen(true)}>
            <TrashIcon />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <EditApplicationPopup
        application={application}
        open={editOpen}
        onOpenChange={setEditOpen}
        onUpdated={onUpdated}
        resumes={resumes}
      />

      <DeleteApplicationPopup
        applicationId={application.id}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onDeleted={onDeleted}
        onClose={() => {
          setDeleteOpen(false);
        }}
      />
    </>
  );
};
