import { NewApplication } from "@/components/NewApplication";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { useLoaderData } from "react-router";

export const Applications = () => {
  const result = useLoaderData();

  return (
    <div className="applications_root">
      <SidebarProvider>
        <Sidebar className="applications_nav">
          <SidebarHeader className="applications_nav_header"></SidebarHeader>

          <SidebarContent>
            <NewApplication />
          </SidebarContent>
          <SidebarFooter></SidebarFooter>
        </Sidebar>
      </SidebarProvider>
    </div>
  );
};
