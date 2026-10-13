import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { NewApplication } from "./NewApplication";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { ChevronDown } from "lucide-react";
import type { JobApplication } from "@/lib/types";
import { Show, SignOutButton } from "@clerk/react";
import { Button } from "./ui/button";

export const Navbar = ({
  onCreated,
}: {
  onCreated: (application: JobApplication) => void;
}) => {
  return (
    <div className="navbar">
      <SidebarProvider>
        <Sidebar className="applications_nav">
          <SidebarHeader className="applications_nav_header"></SidebarHeader>
          <SidebarContent>
            <Collapsible defaultOpen className="group/collapsible">
              <SidebarGroup className="group_applications">
                <Show when="signed-in">
                  <SignOutButton>
                    <Button id={"nav_btn_signout"}>Sign Out</Button>
                  </SignOutButton>
                </Show>
              </SidebarGroup>
            </Collapsible>
            <Collapsible defaultOpen className="group/collapsible">
              <SidebarGroup className="group_applications">
                <SidebarGroupLabel render={<CollapsibleTrigger />}>
                  Applications
                  <ChevronDown className="ml-auto transition-transform group-data-open/collapsible:rotate-180" />
                </SidebarGroupLabel>
                <CollapsibleContent>
                  <NewApplication onCreated={onCreated} />
                </CollapsibleContent>
              </SidebarGroup>
            </Collapsible>
          </SidebarContent>
          <SidebarFooter></SidebarFooter>
        </Sidebar>
      </SidebarProvider>
    </div>
  );
};
