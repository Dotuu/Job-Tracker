import type { JobApplication, Resume, Tag } from "@/lib/types";
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
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import { ApplicationNotesMenu } from "../../ApplicationNotesMenu";
import { Button } from "../../ui/button";

interface JobApplicationProps {
  applicationData: JobApplication[];
  onDeleted: (id: number) => void;
  onUpdated: (application: JobApplication) => void;
  onNotesUpdate: (id: number, notes: string) => void;
  onUnlinkResume: (applicationId: number) => void;
  resumes: Resume[];
  tags: Tag[];
  activeTagIds: number[];
  onToggleTag: (tagId: number) => void;
  emptyTitle?: string;
  emptyHint?: string;
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
    } catch (error) {
      console.error("Failed to copy address", error);
    }
  };

  return (
    <Popover onOpenChange={(open) => !open && setCopied(false)}>
      <PopoverTrigger
        className="location_pill location_pill_copyable"
        openOnHover
        delay={200}
        onClick={copyAddress}
      >
        {content}
      </PopoverTrigger>
      <PopoverContent side="top" className="table_popover">
        <span>{location}</span>
        <span className="table_popover_hint">
          {copied ? "Copied!" : "Click to copy"}
        </span>
      </PopoverContent>
    </Popover>
  );
};

const MAX_VISIBLE_TAGS = 2;

const TagChips = ({
  tags,
  activeTagIds,
  onToggle,
}: {
  tags: Tag[];
  activeTagIds: number[];
  onToggle: (tagId: number) => void;
}) => {
  if (tags.length === 0) return "—";

  const visible = tags.slice(0, MAX_VISIBLE_TAGS);
  const hidden = tags.slice(MAX_VISIBLE_TAGS);

  return (
    <span className="tag_list">
      {visible.map((tag) => {
        const active = activeTagIds.includes(tag.id);
        return (
          <button
            key={tag.id}
            type="button"
            className={`tag_chip${active ? " tag_chip_active" : ""}`}
            aria-pressed={active}
            title={
              active ? `Remove ${tag.name} filter` : `Filter by ${tag.name}`
            }
            onClick={() => onToggle(tag.id)}
          >
            <span className="tag_dot" style={{ background: tag.colorHex }} />
            <span className="tag_chip_name">{tag.name}</span>
          </button>
        );
      })}
      {hidden.length > 0 && (
        <Popover>
          <PopoverTrigger
            className="tag_more"
            openOnHover
            delay={200}
            aria-label={`Show ${hidden.length} more tags`}
          >
            +{hidden.length}
          </PopoverTrigger>
          <PopoverContent side="top" className="table_popover">
            <span className="tag_more_list">
              {hidden.map((tag) => tag.name).join(", ")}
            </span>
          </PopoverContent>
        </Popover>
      )}
    </span>
  );
};

const SortableHead = ({
  label,
  column,
  sortedCol,
  asc,
  onSort,
  className,
}: {
  label: string;
  column: keyof JobApplication;
  sortedCol: keyof JobApplication | null;
  asc: boolean;
  onSort: (column: keyof JobApplication) => void;
  className?: string;
}) => {
  const active = sortedCol === column;
  const Icon = !active ? ArrowUpDown : asc ? ArrowUp : ArrowDown;

  return (
    <TableHead className={className}>
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
  onUnlinkResume,
  resumes,
  tags,
  activeTagIds,
  onToggleTag,
  emptyTitle = "No applications yet",
  emptyHint = "Use “New Application” in the sidebar to add your first one.",
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

  const tagsById = new Map(tags.map((tag) => [tag.id, tag]));
  const tagsFor = (application: JobApplication) =>
    (application.tagIds ?? []).flatMap((id) => tagsById.get(id) ?? []);

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
            <SortableHead
              label="Role"
              column="roleTitle"
              className="col_role"
              {...sortProps}
            />
            <SortableHead label="Status" column="status" {...sortProps} />
            <SortableHead
              label="Date Applied"
              column="dateApplied"
              className="col_date"
              {...sortProps}
            />
            <TableHead className="col_location">Location</TableHead>
            <TableHead className="col_tags">Tags</TableHead>
            <TableHead className="col_source">Source</TableHead>
            <TableHead className="col_icon">Notes</TableHead>
            <TableHead className="col_icon">
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applicationData.length === 0 && (
            <TableRow className="table_empty_row">
              <TableCell colSpan={9}>
                <div className="table_empty">
                  <BriefcaseBusinessIcon />
                  <p>{emptyTitle}</p>
                  <span>{emptyHint}</span>
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
                <span className="table_company_meta">
                  {application.roleTitle} · {formatDate(application.dateApplied)}
                </span>
              </TableCell>
              <TableCell className="col_role">{application.roleTitle}</TableCell>
              <TableCell>
                <span
                  className={`status_pill status_${application.status.toLowerCase()}`}
                >
                  {formatEnum(application.status)}
                </span>
              </TableCell>
              <TableCell className="table_muted col_date">
                {formatDate(application.dateApplied)}
              </TableCell>
              <TableCell className="table_muted col_location">
                <LocationPill
                  locationType={application.locationType}
                  location={application.location}
                />
              </TableCell>
              <TableCell className="table_muted col_tags">
                <TagChips
                  tags={tagsFor(application)}
                  activeTagIds={activeTagIds}
                  onToggle={onToggleTag}
                />
              </TableCell>
              <TableCell className="table_muted col_source">
                {application.source || "—"}
              </TableCell>
              <TableCell
                className="table_notes col_icon"
                title={application.notes}
              >
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
              <TableCell className="col_icon">
                <ApplicationTableMenu
                  application={application}
                  onDeleted={onDeleted}
                  onUpdated={onUpdated}
                  onUnlinkResume={onUnlinkResume}
                  resumes={resumes}
                  tags={tags}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
