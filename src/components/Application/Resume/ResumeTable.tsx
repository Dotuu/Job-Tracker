import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Resume } from "@/lib/types";
import {
  BriefcaseBusiness,
  Check,
  FileText,
  Pencil,
  Star,
  Trash2,
  X,
} from "lucide-react";
import { useState, type KeyboardEvent, type ReactElement } from "react";

interface ResumeTableProps {
  resumes: Resume[];
  onRename: (id: number, fileName: string) => void;
  onDelete: (id: number) => void;
  onSetDefault: (newDefaultId: number, previousDefaultId?: number) => void;
}

const formatSize = (bytes?: number) => {
  if (!bytes) return null;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const formatDate = (date?: string) =>
  date
    ? new Date(date).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

const IconAction = ({
  label,
  children,
}: {
  label: string;
  children: ReactElement;
}) => (
  <Tooltip>
    <TooltipTrigger delay={300} render={children} />
    <TooltipContent>{label}</TooltipContent>
  </Tooltip>
);

export const ResumeTable = ({
  resumes,
  onRename,
  onDelete,
  onSetDefault,
}: ResumeTableProps) => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [draftName, setDraftName] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  const currentDefaultId = resumes.find((r) => r.isDefault)?.id;

  const startEdit = (resume: Resume) => {
    setConfirmDeleteId(null);
    setEditingId(resume.id!);
    setDraftName(resume.fileName);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setDraftName("");
  };

  const saveEdit = (resume: Resume) => {
    const trimmed = draftName.trim();
    if (trimmed && trimmed !== resume.fileName) {
      onRename(resume.id!, trimmed);
    }
    cancelEdit();
  };

  const handleKeyDown = (
    e: KeyboardEvent<HTMLInputElement>,
    resume: Resume,
  ) => {
    if (e.key === "Enter") saveEdit(resume);
    if (e.key === "Escape") {
      e.stopPropagation();
      cancelEdit();
    }
  };

  if (resumes.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed py-10 text-center text-sm text-muted-foreground">
        <FileText className="size-8 opacity-50" />
        <p>No resumes uploaded yet.</p>
      </div>
    );
  }

  return (
    <ul className="max-h-80 divide-y overflow-y-auto rounded-lg border">
      {resumes.map((resume) => {
        const isEditing = editingId === resume.id;
        const isConfirmingDelete = confirmDeleteId === resume.id;
        const meta = [
          formatSize(resume.sizeBytes),
          formatDate(resume.uplodedAt),
        ]
          .filter(Boolean)
          .join(" · ");

        return (
          <li
            key={resume.id}
            className="group flex items-center gap-3 px-3 py-2.5 hover:bg-muted/40"
          >
            <FileText className="size-5 shrink-0 text-muted-foreground" />

            <div className="min-w-0 flex-1">
              {isEditing ? (
                <Input
                  autoFocus
                  value={draftName}
                  onChange={(e) => setDraftName(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, resume)}
                  className="h-7"
                />
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => startEdit(resume)}
                      className="truncate text-left text-sm font-medium hover:underline"
                      title="Click to rename"
                    >
                      {resume.fileName}
                    </button>
                    {resume.isDefault && (
                      <span className="shrink-0 rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium text-secondary-foreground">
                        Default
                      </span>
                    )}
                  </div>
                  {meta && (
                    <p className="text-xs text-muted-foreground">{meta}</p>
                  )}
                </>
              )}
            </div>

            <div className="flex shrink-0 items-center gap-1">
              {isEditing ? (
                <>
                  <IconAction label="Save">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => saveEdit(resume)}
                    >
                      <Check />
                    </Button>
                  </IconAction>
                  <IconAction label="Cancel">
                    <Button variant="ghost" size="icon-sm" onClick={cancelEdit}>
                      <X />
                    </Button>
                  </IconAction>
                </>
              ) : isConfirmingDelete ? (
                <>
                  <span className="mr-1 text-xs text-muted-foreground">
                    Delete?
                  </span>
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => setConfirmDeleteId(null)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    size="xs"
                    onClick={() => {
                      onDelete(resume.id!);
                      setConfirmDeleteId(null);
                    }}
                  >
                    Delete
                  </Button>
                </>
              ) : (
                <>
                  {resume.isDefault ? (
                    <IconAction label="Default resume">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-disabled
                        className="cursor-default hover:bg-transparent"
                      >
                        <Star className="fill-amber-400 text-amber-400" />
                      </Button>
                    </IconAction>
                  ) : (
                    <IconAction label="Set as default">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="text-muted-foreground hover:text-amber-500"
                        onClick={() =>
                          onSetDefault(resume.id!, currentDefaultId)
                        }
                      >
                        <Star />
                      </Button>
                    </IconAction>
                  )}
                  <IconAction label="Rename">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => startEdit(resume)}
                    >
                      <Pencil />
                    </Button>
                  </IconAction>
                  {/* TODO: placeholder until resume <-> application linking exists */}
                  <IconAction label="Linked applications (coming soon)">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-disabled
                      className="cursor-not-allowed opacity-50"
                    >
                      <BriefcaseBusiness />
                    </Button>
                  </IconAction>
                  <IconAction label="Delete">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="text-muted-foreground hover:text-destructive"
                      onClick={() => setConfirmDeleteId(resume.id!)}
                    >
                      <Trash2 />
                    </Button>
                  </IconAction>
                </>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
};
