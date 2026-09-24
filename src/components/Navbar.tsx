import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarProvider,
} from "@/components/ui/sidebar";

export const Navbar = () => {
  return (
    <div className="navbar">
      <SidebarProvider>
        <Sidebar className="applications_nav">
          <SidebarHeader className="applications_nav_header"></SidebarHeader>
          <SidebarContent>
            <SidebarGroup></SidebarGroup>
          </SidebarContent>
          <SidebarFooter></SidebarFooter>
        </Sidebar>
      </SidebarProvider>
    </div>
  );
};
