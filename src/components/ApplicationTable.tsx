import type { ApplicationDataProps } from "@/lib/ApplicationData";
import type { NewApplicationProps } from "./NewApplication";
import {
  Table,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

export const ApplicationTable = ({ applicationName }: ApplicationDataProps) => {
  return (
    <div className="application_table">
      <Table>
        <TableCaption>List of all applications</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Company Name</TableHead>
            <TableHead>Notes</TableHead>
            <TableHead>Application Status</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
      </Table>
    </div>
  );
};
