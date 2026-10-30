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
import type { JobApplication, Resume, Tag } from "@/lib/types";
import { Show, SignOutButton } from "@clerk/react";
import { Button } from "./ui/button";
import "./Navbar.scss";
import { NewResume } from "./Application/Resume/NewResume";
import { ViewResume } from "./Application/Resume/ViewResume";
import { Tags, type TagProps } from "./Application/Tag/Tags";
import { TagsAction } from "./Application/Tag/TagsAction";

interface NavbarProps {
  onCreated: (application: JobApplication) => void;
  submitResume: (file: File, title: string) => Promise<boolean>;
  onRenameResume: (id: number, fileName: string) => void;
  onDeleteResume: (id: number) => void;
  onSetDefaultResume: (id: number) => void;
  onShowLinkedApplications: (resumeId: number) => void;
  resumes: Resume[];
  applications: JobApplication[];
  tags: Tag[];
  newTag: (tag: TagProps) => void;
  updateTag: (tag: TagProps) => void;
  deleteTag: (tagId: number) => void;
  activeTagIds: number[];
  onToggleTag: (tagId: number) => void;
  onClearTags: () => void;
}

export const Navbar = ({
  onCreated,
  submitResume,
  onRenameResume,
  onDeleteResume,
  onSetDefaultResume,
  onShowLinkedApplications,
  resumes,
  applications,
  tags,
  newTag,
  updateTag,
  deleteTag,
  activeTagIds,
  onToggleTag,
  onClearTags,
}: NavbarProps) => {
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
              <NewApplication
                resumes={resumes}
                tags={tags}
                onCreated={onCreated}
              />
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
              <ViewResume
                resumes={resumes}
                applications={applications}
                onRename={onRenameResume}
                onDelete={onDeleteResume}
                onSetDefault={onSetDefaultResume}
                onShowLinked={onShowLinkedApplications}
              />
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>
        <Collapsible defaultOpen className="group/collapsible">
          <SidebarGroup className="group_tags">
            <SidebarGroupLabel render={<CollapsibleTrigger />}>
              Tags
              <ChevronDown className="ml-auto transition-transform group-data-open/collapsible:rotate-180" />
            </SidebarGroupLabel>
            <CollapsibleContent className="nav_group_content">
              <TagsAction
                tags={tags}
                newTag={newTag}
                updateTag={updateTag}
                deleteTag={deleteTag}
              />
              <Collapsible defaultOpen className="group/view">
                <SidebarGroupLabel
                  render={<CollapsibleTrigger />}
                  className="w-full"
                >
                  View
                  <ChevronDown className="ml-auto transition-transform group-data-open/view:rotate-180" />
                </SidebarGroupLabel>
                <CollapsibleContent className="pl-3">
                  <Tags
                    tags={tags}
                    activeTagIds={activeTagIds}
                    onToggle={onToggleTag}
                    onClear={onClearTags}
                  />
                </CollapsibleContent>
              </Collapsible>
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
