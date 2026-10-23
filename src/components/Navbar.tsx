import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { NewApplication } from "./NewApplication";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { BriefcaseBusinessIcon, ChevronDown, LogOutIcon } from "lucide-react";
import type { JobApplication, Resume } from "@/lib/types";
import { Show, SignOutButton } from "@clerk/react";
import { Button } from "./ui/button";
import "./Navbar.scss";
import { NewResume } from "./Application/Resume/NewResume";

interface NavbarProps {
  onCreated: (application: JobApplication) => void;
  submitResume: (resume: Resume) => void;
}

export const Navbar = ({ onCreated, submitResume }: NavbarProps) => {
  return (
    <Sidebar className="applications_nav">
      <SidebarHeader className="applications_nav_header">
        <div className="nav_brand">
          <span className="nav_brand_icon">
            <BriefcaseBusinessIcon />
          </span>
          <span className="nav_brand_name">JobTracker</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <Collapsible defaultOpen className="group/collapsible">
          <SidebarGroup className="group_applications">
            <SidebarGroupLabel render={<CollapsibleTrigger />}>
              Applications
              <ChevronDown className="ml-auto transition-transform group-data-open/collapsible:rotate-180" />
            </SidebarGroupLabel>
            <CollapsibleContent className="nav_group_content">
              <NewApplication onCreated={onCreated} />
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>
        <Collapsible defaultOpen className="group/collapsible">
          <SidebarGroup className="group_resumes">
            <SidebarGroupLabel render={<CollapsibleTrigger />}>
              Resumes
              <ChevronDown className="ml-auto transition-transform group-data-open/collapsible:rotate-180" />
            </SidebarGroupLabel>
            <CollapsibleContent className="nav_group_content">
              <NewResume submitResume={submitResume} />
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>
      </SidebarContent>
      <SidebarFooter className="applications_nav_footer">
        <Show when="signed-in">
          <SignOutButton>
            <Button id={"nav_btn_signout"} variant="outline">
              <LogOutIcon />
              Sign Out
            </Button>
          </SignOutButton>
        </Show>
      </SidebarFooter>
    </Sidebar>
  );
};
