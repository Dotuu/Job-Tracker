import type { JobApplication } from "@/lib/types";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { ApplicationTableMenu } from "./ApplicationTableMenu";

interface JobApplicationProps {
  applicationData: JobApplication[];
  onDeleted: (id: number) => void;
  onUpdated: (application: JobApplication) => void;
}

export const ApplicationTable = ({
  applicationData,
  onDeleted,
  onUpdated,
}: JobApplicationProps) => {
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
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applicationData.map((application) => (
            <TableRow key={application.id}>
              <TableCell>{application.companyName}</TableCell>
              <TableCell>{application.roleTitle}</TableCell>
              <TableCell>{application.status}</TableCell>
              <TableCell>{application.dateApplied}</TableCell>
              <TableCell>{application.source}</TableCell>
              <TableCell>{application.notes}</TableCell>
              <TableCell>
                {
                  <ApplicationTableMenu
                    application={application}
                    onDeleted={onDeleted}
                    onUpdated={onUpdated}
                  />
                }
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
