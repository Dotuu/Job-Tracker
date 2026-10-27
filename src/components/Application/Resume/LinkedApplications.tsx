import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { JobApplication, Resume } from "@/lib/types";
import { BriefcaseBusiness, Unlink } from "lucide-react";

interface LinkedApplicationsProps {
  resume: Resume | null;
  applications: JobApplication[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUnlink: (applicationId: number) => void;
}

export const LinkedApplications = ({
  resume,
  applications,
  open,
  onOpenChange,
  onUnlink,
}: LinkedApplicationsProps) => {
  const linkedApplications = applications.filter(
    (application) => application.resumeId === resume?.id,
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Linked applications</DialogTitle>
          <DialogDescription>
            {`Applications using ${resume?.fileName ?? "this resume"}.`}
          </DialogDescription>
        </DialogHeader>

        {linkedApplications.length === 0 ? (
          <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed py-10 text-center text-sm text-muted-foreground">
            <BriefcaseBusiness className="size-8 opacity-50" />
            <p>No applications linked to this resume.</p>
          </div>
        ) : (
          <ul className="max-h-80 divide-y overflow-y-auto rounded-lg border">
            {linkedApplications.map((application) => (
              <li
                key={application.id}
                className="flex items-center gap-3 px-3 py-2.5 hover:bg-muted/40"
              >
                <BriefcaseBusiness className="size-5 shrink-0 text-muted-foreground" />

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">
                    {application.companyName}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {application.roleTitle}
                  </p>
                </div>

                <Tooltip>
                  <TooltipTrigger
                    delay={300}
                    render={
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="text-muted-foreground hover:text-destructive"
                        onClick={() => onUnlink(application.id)}
                      >
                        <Unlink />
                      </Button>
                    }
                  />
                  <TooltipContent>Unlink</TooltipContent>
                </Tooltip>
              </li>
            ))}
          </ul>
        )}
      </DialogContent>
    </Dialog>
  );
};
