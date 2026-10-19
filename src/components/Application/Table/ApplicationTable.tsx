import type { JobApplication } from "@/lib/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { ApplicationTableMenu } from "../Table/ApplicationTableMenu";
import { format, parseISO } from "date-fns";
import {
  ArrowDown,
  ArrowRightLeft,
  ArrowUp,
  ArrowUpDown,
  BriefcaseBusinessIcon,
  BuildingComplex,
  House,
  NotebookPen,
  type LucideIcon,
} from "lucide-react";
import "./ApplicationTable.scss";
import { useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../ui/tooltip";
import { ApplicationNotesMenu } from "../../ApplicationNotesMenu";
import { Button } from "../../ui/button";

interface JobApplicationProps {
  applicationData: JobApplication[];
  onDeleted: (id: number) => void;
  onUpdated: (application: JobApplication) => void;
  onNotesUpdate: (id: number, notes: string) => void;
}

const formatEnum = (value: string) =>
  value
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const formatDate = (date?: string) =>
  date ? format(parseISO(date), "MMM d, yyyy") : "—";

const LOCATION_ICONS: Record<string, LucideIcon> = {
  REMOTE: House,
  HYBRID: ArrowRightLeft,
  ON_SITE: BuildingComplex,
};

const LocationPill = ({
  locationType,
  location,
}: {
  locationType?: string;
  location?: string;
}) => {
  const [copied, setCopied] = useState(false);

  if (!locationType) return "—";
  const Icon = LOCATION_ICONS[locationType];
  const content = (
    <>
      {Icon && <Icon />}
      {formatEnum(locationType)}
    </>
  );

  if (locationType === "REMOTE" || !location?.trim()) {
    return <span className="location_pill">{content}</span>;
  }

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(location);
      setCopied(true);
    } catch {}
  };

  return (
    <Tooltip onOpenChange={(open) => !open && setCopied(false)}>
      <TooltipTrigger
        className="location_pill location_pill_copyable"
        delay={200}
        closeOnClick={false}
        onClick={copyAddress}
      >
        {content}
      </TooltipTrigger>
      <TooltipContent>
        {copied ? "Copied!" : `${location} · Click to copy`}
      </TooltipContent>
    </Tooltip>
  );
};

const SortableHead = ({
  label,
  column,
  sortedCol,
  asc,
  onSort,
}: {
  label: string;
  column: keyof JobApplication;
  sortedCol: keyof JobApplication | null;
  asc: boolean;
  onSort: (column: keyof JobApplication) => void;
}) => {
  const active = sortedCol === column;
  const Icon = !active ? ArrowUpDown : asc ? ArrowUp : ArrowDown;

  return (
    <TableHead>
      <span className="sortable_head">
        {label}
        <Button
          variant="ghost"
          size="icon-sm"
          className={`sort_button${active ? " sort_button_active" : ""}`}
          aria-label={`Sort by ${label}`}
          onClick={() => onSort(column)}
        >
          <Icon />
        </Button>
      </span>
    </TableHead>
  );
};

export const ApplicationTable = ({
  applicationData,
  onDeleted,
  onUpdated,
  onNotesUpdate,
}: JobApplicationProps) => {
  const [openNotesId, setOpenNotesId] = useState<number | null>(null);
  const [sortedCol, setSortedCol] = useState<keyof JobApplication | null>(null);
  const [asc, setAsc] = useState(true);

  const sortedData = sortedCol
    ? [...applicationData].sort((a, b) => {
        const cmp = String(a[sortedCol]).localeCompare(String(b[sortedCol]));
        return asc ? cmp : -cmp;
      })
    : applicationData;

  const handleSort = (column: keyof JobApplication) => {
    setAsc((prev) => (sortedCol === column ? !prev : true));
    setSortedCol(column);
  };

  const sortProps = { sortedCol, asc, onSort: handleSort };

  return (
    <div className="application_table">
      <Table>
        <TableHeader>
          <TableRow>
            <SortableHead
              label="Company Name"
              column="companyName"
              {...sortProps}
            />
            <SortableHead label="Role" column="roleTitle" {...sortProps} />
            <SortableHead label="Status" column="status" {...sortProps} />
            <SortableHead
              label="Date Applied"
              column="dateApplied"
              {...sortProps}
            />
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
          {sortedData.map((application) => (
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
                  {formatEnum(application.status)}
                </span>
              </TableCell>
              <TableCell className="table_muted">
                {formatDate(application.dateApplied)}
              </TableCell>
              <TableCell className="table_muted">
                <LocationPill
                  locationType={application.locationType}
                  location={application.location}
                />
              </TableCell>
              <TableCell className="table_muted">
                {application.source || "—"}
              </TableCell>
              <TableCell className="table_notes" title={application.notes}>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Open notes"
                  onClick={() => setOpenNotesId(application.id)}
                >
                  <NotebookPen />
                </Button>
                <ApplicationNotesMenu
                  companyName={application.companyName}
                  roleTitle={application.roleTitle}
                  notes={application.notes}
                  open={openNotesId === application.id}
                  onOpenChange={(open) => !open && setOpenNotesId(null)}
                  onNotesUpdate={(notes) => {
                    onNotesUpdate(application.id, notes);
                    setOpenNotesId(null);
                  }}
                />
              </TableCell>
              <TableCell>
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
