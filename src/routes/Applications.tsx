import { ApplicationTable } from "@/components/Application/Table/ApplicationTable";
import { useAuthToken } from "@/hooks/use-api";
import { getApplications, searchApplication } from "@/lib/api";
import { useDebouncedCallback } from "use-debounce";
import "./Applications.scss";
import { ApplicationSearch } from "@/components/ApplicationSearch";
import { useAppData } from "@/hooks/use-app-data";

export const Applications = () => {
  const getAuthToken = useAuthToken();
  const {
    applications,
    setApplications,
    resumes,
    tags,
    error,
    resumeFilter,
    activeTagIds,
    toggleTag,
    onUpdated,
    onDeleted,
    onNotesUpdate,
    onUnlinkResume,
  } = useAppData();

  const visibleApplications = applications.filter(
    (app) =>
      (!resumeFilter || app.resumeId === resumeFilter.id) &&
      activeTagIds.every((id) => app.tagIds?.includes(id)),
  );
  const isFiltered = resumeFilter !== null || activeTagIds.length > 0;

  const handleSearch = useDebouncedCallback(async (query: string) => {
    try {
      const token = await getAuthToken();
      setApplications(
        query.trim() === ""
          ? await getApplications(token)
          : await searchApplication(token, query.trim()),
      );
    } catch (error) {
      console.error("Search failed", error);
    }
  }, 200);

  return (
    <section className="applications_content">
      <div className="applications_header_group">
        <div className="applications_title">
          <h1>Applications</h1>
          <p>
            {visibleApplications.length}{" "}
            {visibleApplications.length === 1 ? "application" : "applications"}{" "}
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
        onDeleted={onDeleted}
        onUpdated={onUpdated}
        onNotesUpdate={onNotesUpdate}
        onUnlinkResume={onUnlinkResume}
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
  );
};
