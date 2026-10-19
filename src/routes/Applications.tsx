import { ApplicationTable } from "@/components/Application/Table/ApplicationTable";
import { Navbar } from "@/components/Navbar";
import { useAuthToken } from "@/hooks/use-api";
import { getApplications, searchApplication, updateNotes } from "@/lib/api";
import type { JobApplication } from "@/lib/types";
import { useAuth } from "@clerk/react";
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

export const Applications = () => {
  const { isLoaded, isSignedIn } = useAuth();
  const getAuthToken = useAuthToken();
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [error, setError] = useState<string | null>(null);

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

        if (!ignore) {
          setApplications(data);
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

  const handleCreated = (application: JobApplication) => {
    setApplications((prev) => [...prev, application]);
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

  const handleDeleted = (id: number) => {
    setApplications((prev) => prev.filter((app) => app.id !== id));
  };

  return (
    <SidebarProvider>
      <Navbar onCreated={handleCreated} />
      <SidebarInset>
        <header className="applications_header">
          <SidebarTrigger />
          <Separator
            orientation="vertical"
            className="applications_header_sep"
          />
          <span className="applications_header_crumb">Applications</span>
        </header>

        <section className="applications_content">
          <div className="applications_header_group">
            <div className="applications_title">
              <h1>Applications</h1>
              <p>
                {applications.length}{" "}
                {applications.length === 1 ? "application" : "applications"}{" "}
                tracked
              </p>
            </div>
            <ApplicationSearch onSearchChange={handleSearch} />
          </div>

          {error && <div className="applications_error">{error}</div>}

          <ApplicationTable
            applicationData={applications}
            onDeleted={handleDeleted}
            onUpdated={handleUpdated}
            onNotesUpdate={handleNotesUpdate}
          />
        </section>
      </SidebarInset>
    </SidebarProvider>
  );
};
