import { ApplicationTable } from "@/components/ApplicationTable";
import { Navbar } from "@/components/Navbar";
import type { ApplicationDataProps } from "@/lib/ApplicationData";
import { useLoaderData } from "react-router";

export const Applications = () => {
  const result = useLoaderData<ApplicationDataProps>();

  return (
    <div className="applications_root">
      <Navbar />
      <ApplicationTable applicationName={result.applicationName} />
    </div>
  );
};
