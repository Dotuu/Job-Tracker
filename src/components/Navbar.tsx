import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarProvider,
} from "@/components/ui/sidebar";

export const Navbar = () => {
  return (
    <div className="navbar">
      <SidebarProvider>
        <Sidebar>
          <SidebarHeader />
          <SidebarContent>
            <SidebarGroup />
            <SidebarGroupLabel>Applications</SidebarGroupLabel>
            <SidebarGroup />
          </SidebarContent>
          <SidebarFooter />
        </Sidebar>
      </SidebarProvider>
    </div>
  );
};
