import type { JobApplication, Resume, Tag } from "@/lib/types";
import { useOutletContext } from "react-router";

export type AppData = {
  applications: JobApplication[];
  setApplications: React.Dispatch<React.SetStateAction<JobApplication[]>>;
  resumes: Resume[];
  tags: Tag[];
  error: string | null;
  resumeFilter: Resume | null;
  activeTagIds: number[];
  toggleTag: (tagId: number) => void;
  onUpdated: (updated: JobApplication) => void;
  onDeleted: (id: number) => void;
  onNotesUpdate: (id: number, notes: string) => Promise<void>;
  onUnlinkResume: (applicationId: number) => Promise<void>;
};

export const useAppData = () => useOutletContext<AppData>();
