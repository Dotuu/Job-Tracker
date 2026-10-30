import { ApplicationTable } from "@/components/Application/Table/ApplicationTable";
import { Navbar } from "@/components/Navbar";
import { useAuthToken } from "@/hooks/use-api";
import {
  deleteResume,
  getApplications,
  getResumes,
  postResume,
  renameResume,
  setDefaultResume,
  searchApplication,
  updateApplicationResume,
  updateNotes,
  getTags,
  postTag,
} from "@/lib/api";
import type { JobApplication, Resume, Tag } from "@/lib/types";
import { useAuth } from "@clerk/react";
import { ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import "./Applications.scss";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { ApplicationSearch } from "@/components/ApplicationSearch";
import type { TagProps } from "@/components/Application/Tag/Tags";

export const Applications = () => {
  const { isLoaded, isSignedIn } = useAuth();
  const getAuthToken = useAuthToken();
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

  const visibleApplications = applications.filter(
    (app) =>
      (!resumeFilter || app.resumeId === resumeFilter.id) &&
      activeTagIds.every((id) => app.tagIds?.includes(id)),
  );
  const isFiltered = resumeFilter !== null || activeTagIds.length > 0;

  const handleSearch = useDebouncedCallback(async (query: string) => {
    const token = await getAuthToken();
    setApplications(
      query.trim() === ""
        ? await getApplications(token)
        : await searchApplication(token, query.trim()),
    );
  }, 200);

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
    } catch (err) {
      setError((err as Error).message);
      return false;
    }
  };

  const handleCreatedTag = async (tag: TagProps) => {
    try {
      const token = await getAuthToken();
      const created = await postTag(token, tag);
      setTags((prev) => [...prev, created]);
      return true;
    } catch (err) {
      setError((err as Error).message);
      return false;
    }
  };

  const handleRenameResume = async (id: number, fileName: string) => {
    try {
      const token = await getAuthToken();
      const updated = await renameResume(token, id, fileName);
      setResumes((prev) => prev.map((r) => (r.id === id ? updated : r)));
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleSetDefaultResume = async (id: number) => {
    try {
      const token = await getAuthToken();
      const updated = await setDefaultResume(token, id);
      setResumes((prev) =>
        prev.map((r) => (r.id === id ? updated : { ...r, isDefault: false })),
      );
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleDeleteResume = async (id: number) => {
    try {
      const token = await getAuthToken();
      await deleteResume(token, id);
      setResumes(await getResumes(token));
    } catch (err) {
      setError((err as Error).message);
    }
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

  const handleEditTag = async (tag: TagProps) => {
  };

  const handleDeleteTag = async (tagId: number) => {
  };

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

  return (
    <SidebarProvider>
      <Navbar
        onCreated={handleCreatedApplication}
        submitResume={handleCreatedResume}
        onRenameResume={handleRenameResume}
        onDeleteResume={handleDeleteResume}
        onSetDefaultResume={handleSetDefaultResume}
        onShowLinkedApplications={setResumeFilterId}
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
            {resumeFilter ? (
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
              <span className="applications_header_crumb">Applications</span>
            )}
          </nav>
        </header>

        <section className="applications_content">
          <div className="applications_header_group">
            <div className="applications_title">
              <h1>Applications</h1>
              <p>
                {visibleApplications.length}{" "}
                {visibleApplications.length === 1
                  ? "application"
                  : "applications"}{" "}
                {resumeFilter
                  ? `using ${resumeFilter.fileName}`
                  : isFiltered
                    ? "shown"
                    : "tracked"}
              </p>
            </div>
            <ApplicationSearch onSearchChange={handleSearch} />
          </div>

          {error && <div className="applications_error">{error}</div>}

          <ApplicationTable
            applicationData={visibleApplications}
            onDeleted={handleDeleted}
            onUpdated={handleUpdated}
            onNotesUpdate={handleNotesUpdate}
            onUnlinkResume={handleUnlinkResume}
            resumes={resumes}
            tags={tags}
            activeTagIds={activeTagIds}
            onToggleTag={toggleTag}
            emptyTitle={
              resumeFilter
                ? "No linked applications"
                : isFiltered
                  ? "No matching applications"
                  : undefined
            }
            emptyHint={
              resumeFilter
                ? "Link this resume from an application's Edit form."
                : isFiltered
                  ? "No application has every selected tag."
                  : undefined
            }
          />
        </section>
      </SidebarInset>
    </SidebarProvider>
  );
};
