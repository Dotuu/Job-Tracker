import type { JobApplication } from "@/lib/types";
import {
  Table,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

interface JobApplicationProps {
  applicationData: JobApplication[];
}

export const ApplicationTable = ({ applicationData }: JobApplicationProps) => {
  return (
    <div className="application_table">
      <Table>
        <TableCaption>List of all applications</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Company Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date Applied</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Source</TableHead>
            <TableHead>Notes</TableHead>
          </TableRow>
        </TableHeader>
        {applicationData.map((application) => (
          <TableRow key={application.jobId}>
            <TableCell>{application.companyName}</TableCell>
            <TableCell>{application.roleTitle}</TableCell>
            <TableCell>{application.jobStatus}</TableCell>
            <TableCell>{application.appliedDate}</TableCell>
            <TableCell>{application.jobSource}</TableCell>
            <TableCell>{application.notes}</TableCell>
          </TableRow>
        ))}
      </Table>
    </div>
  );
};
