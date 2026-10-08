import { ApplicationTable } from "@/components/ApplicationTable";
import { Navbar } from "@/components/Navbar";
import { useAuthToken } from "@/hooks/use-api";
import { getApplications } from "@/lib/api";
import type { JobApplication } from "@/lib/types";
import { useAuth } from "@clerk/react";
import { useEffect, useState } from "react";

export const Applications = () => {
  const { isLoaded, isSignedIn } = useAuth();
  const getAuthToken = useAuthToken();
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [error, setError] = useState<String | null>(null);

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

  return (
    <div className="applications_root">
      <Navbar />
      <ApplicationTable applicationData={applications} />
    </div>
  );
};
