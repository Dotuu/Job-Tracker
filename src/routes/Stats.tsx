import { useEffect, useRef, useState } from "react";
import { useAppData } from "./AppLayout";
import { useAuthToken } from "@/hooks/use-api";
import type { StatusHistory } from "@/lib/types";
import { getAllStats } from "@/lib/api";
import { computeStats } from "@/lib/stats";

export const Stats = () => {
  const { applications } = useAppData();

  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<StatusHistory[] | null>(null);

  const fetchEnabledRef = useRef(true);

  const getAuthToken = useAuthToken();

  useEffect(() => {
    computeStats(applications);
    console.log(error);
  }, [error]);

  useEffect(() => {
    if (fetchEnabledRef.current === true) return;

    getStats();

    return () => {
      fetchEnabledRef.current = false;
    };
  }, []);

  const getStats = async () => {
    try {
      const token = await getAuthToken();
      const data = await getAllStats(token);

      setStats(data);
    } catch (error) {
      setError((error as Error).message);
    }
  };

  return (
    <section className="applications_content">
      <div className="applications_header_group">
        <div className="applications_title">
          <h1>Stats</h1>
          <p>{applications.length} applications tracked</p>
        </div>
      </div>
    </section>
  );
};
