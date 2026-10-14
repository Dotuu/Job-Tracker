import type { JobApplication } from "@/lib/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { ApplicationTableMenu } from "./ApplicationTableMenu";
import { format, parseISO } from "date-fns";
import { BriefcaseBusinessIcon } from "lucide-react";
import "./ApplicationTable.scss";

interface JobApplicationProps {
  applicationData: JobApplication[];
  onDeleted: (id: number) => void;
  onUpdated: (application: JobApplication) => void;
}

// "PHONE_SCREEN" -> "Phone Screen"
const formatStatus = (status: string) =>
  status
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const formatDate = (date?: string) =>
  date ? format(parseISO(date), "MMM d, yyyy") : "—";

export const ApplicationTable = ({
  applicationData,
  onDeleted,
  onUpdated,
}: JobApplicationProps) => {
  return (
    <div className="application_table">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Company Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date Applied</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Source</TableHead>
            <TableHead>Notes</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applicationData.length === 0 && (
            <TableRow className="table_empty_row">
              <TableCell colSpan={8}>
                <div className="table_empty">
                  <BriefcaseBusinessIcon />
                  <p>No applications yet</p>
                  <span>
                    Use “New Application” in the sidebar to add your first one.
                  </span>
                </div>
              </TableCell>
            </TableRow>
          )}
          {applicationData.map((application) => (
            <TableRow key={application.id}>
              <TableCell className="table_company">
                {application.jobUrl ? (
                  <a
                    href={application.jobUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {application.companyName}
                  </a>
                ) : (
                  application.companyName
                )}
              </TableCell>
              <TableCell>{application.roleTitle}</TableCell>
              <TableCell>
                <span
                  className={`status_pill status_${application.status.toLowerCase()}`}
                >
                  {formatStatus(application.status)}
                </span>
              </TableCell>
              <TableCell className="table_muted">
                {formatDate(application.dateApplied)}
              </TableCell>
              <TableCell className="table_muted">—</TableCell>
              <TableCell className="table_muted">
                {application.source || "—"}
              </TableCell>
              <TableCell className="table_notes" title={application.notes}>
                {application.notes || "—"}
              </TableCell>
              <TableCell className="table_actions">
                <ApplicationTableMenu
                  application={application}
                  onDeleted={onDeleted}
                  onUpdated={onUpdated}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
