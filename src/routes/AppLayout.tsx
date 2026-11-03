import { Navbar } from "@/components/Navbar";
import { useAuthToken } from "@/hooks/use-api";
import {
  deleteResume,
  getApplications,
  getResumes,
  postResume,
  renameResume,
  setDefaultResume,
  updateApplicationResume,
  updateNotes,
  getTags,
  postTag,
} from "@/lib/api";
import type { JobApplication, Resume, Tag } from "@/lib/types";
import { useAuth } from "@clerk/react";
import { ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Outlet,
  useMatches,
  useNavigate,
  useOutletContext,
} from "react-router";
import "./Applications.scss";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import type { TagProps } from "@/components/Application/Tag/Tags";

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

export const AppLayout = () => {
  const { isLoaded, isSignedIn } = useAuth();
  const getAuthToken = useAuthToken();
  const navigate = useNavigate();
  const matches = useMatches();
  const crumb = (matches.at(-1)?.handle as { crumb?: string } | undefined)
    ?.crumb;

  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [resumes, setResumes] = useState<Resume[]>([]);
  const [resumeFilterId, setResumeFilterId] = useState<number | null>(null);
  const resumeFilter = resumes.find((r) => r.id === resumeFilterId) ?? null;

  const [tags, setTags] = useState<Tag[]>([]);
  const [activeTagIds, setActiveTagIds] = useState<number[]>([]);

  const toggleTag = (tagId: number) => {
    setActiveTagIds((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId],
    );
  };

  useEffect(() => {
    document.documentElement.classList.add("dark");
    return () => document.documentElement.classList.remove("dark");
  }, []);

  useEffect(() => {
    if (!isLoaded || !isSignedIn) {
      return;
    }

    let ignore = false;
    const loadApplications = async () => {
      try {
        const token = await getAuthToken();
        const data = await getApplications(token);
        const resumeData = await getResumes(token);
        const tagData = await getTags(token);

        if (!ignore) {
          setApplications(data);
          setResumes(resumeData);
          setTags(tagData);
        }
      } catch (error) {
        if (!ignore) {
          setError((error as Error).message);
        }
      }
    };

    loadApplications();

    return () => {
      ignore = true;
    };
  }, [isLoaded, isSignedIn, getAuthToken]);

  const handleCreatedApplication = (application: JobApplication) => {
    setApplications((prev) => [...prev, application]);
  };

  const handleCreatedResume = async (file: File, title: string) => {
    try {
      const token = await getAuthToken();
      const created = await postResume(token, file, title);
      setResumes((prev) => [...prev, created]);
      return true;
    } catch (error) {
      setError((error as Error).message);
      return false;
    }
  };

  const handleCreatedTag = async (tag: TagProps) => {
    try {
      const token = await getAuthToken();
      const created = await postTag(token, tag);
      setTags((prev) => [...prev, created]);
      return true;
    } catch (error) {
      setError((error as Error).message);
      return false;
    }
  };

  const handleRenameResume = async (id: number, fileName: string) => {
    try {
      const token = await getAuthToken();
      const updated = await renameResume(token, id, fileName);
      setResumes((prev) => prev.map((r) => (r.id === id ? updated : r)));
    } catch (error) {
      setError((error as Error).message);
    }
  };

  const handleSetDefaultResume = async (id: number) => {
    try {
      const token = await getAuthToken();
      const updated = await setDefaultResume(token, id);
      setResumes((prev) =>
        prev.map((r) => (r.id === id ? updated : { ...r, isDefault: false })),
      );
    } catch (error) {
      setError((error as Error).message);
    }
  };

  const handleDeleteResume = async (id: number) => {
    try {
      const token = await getAuthToken();
      await deleteResume(token, id);
      setResumes(await getResumes(token));
    } catch (error) {
      setError((error as Error).message);
    }
  };

  const handleShowLinkedApplications = (resumeId: number) => {
    setResumeFilterId(resumeId);
    navigate("/applications");
  };

  const handleUpdated = (updated: JobApplication) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === updated.id ? updated : app)),
    );
  };

  const handleNotesUpdate = async (id: number, notes: string) => {
    try {
      const token = await getAuthToken();
      await updateNotes(token, id, notes);
      setApplications((prev) =>
        prev.map((app) => (app.id === id ? { ...app, notes } : app)),
      );
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleEditTag = async (tag: TagProps) => {};

  const handleDeleteTag = async (tagId: number) => {};

  const handleUnlinkResume = async (applicationId: number) => {
    try {
      const token = await getAuthToken();
      const updated = await updateApplicationResume(token, applicationId, null);
      handleUpdated(updated);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleDeleted = (id: number) => {
    setApplications((prev) => prev.filter((app) => app.id !== id));
  };

  const appData: AppData = {
    applications,
    setApplications,
    resumes,
    tags,
    error,
    resumeFilter,
    activeTagIds,
    toggleTag,
    onUpdated: handleUpdated,
    onDeleted: handleDeleted,
    onNotesUpdate: handleNotesUpdate,
    onUnlinkResume: handleUnlinkResume,
  };

  return (
    <SidebarProvider>
      <Navbar
        onCreated={handleCreatedApplication}
        submitResume={handleCreatedResume}
        onRenameResume={handleRenameResume}
        onDeleteResume={handleDeleteResume}
        onSetDefaultResume={handleSetDefaultResume}
        onShowLinkedApplications={handleShowLinkedApplications}
        resumes={resumes}
        applications={applications}
        tags={tags}
        newTag={handleCreatedTag}
        updateTag={handleEditTag}
        deleteTag={handleDeleteTag}
        activeTagIds={activeTagIds}
        onToggleTag={toggleTag}
        onClearTags={() => setActiveTagIds([])}
      />
      <SidebarInset>
        <header className="applications_header">
          <SidebarTrigger />
          <Separator
            orientation="vertical"
            className="applications_header_sep"
          />
          <nav aria-label="Breadcrumb" className="applications_header_crumbs">
            {crumb === "Applications" && resumeFilter ? (
              <>
                <button
                  type="button"
                  className="applications_header_crumb applications_header_crumb_link"
                  onClick={() => setResumeFilterId(null)}
                >
                  Applications
                </button>
                <ChevronRight className="applications_header_crumb_sep" />
                <span
                  className="applications_header_crumb applications_header_crumb_current"
                  aria-current="page"
                >
                  {resumeFilter.fileName}
                </span>
              </>
            ) : (
              <span className="applications_header_crumb">{crumb}</span>
            )}
          </nav>
        </header>
        <Outlet context={appData} />
      </SidebarInset>
    </SidebarProvider>
  );
};
