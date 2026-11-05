import { createBrowserRouter } from "react-router";
import App from "./App.tsx";
import { About } from "./routes/About.tsx";
import { AppLayout } from "./routes/AppLayout.tsx";
import { Applications } from "./routes/Applications.tsx";
import { Stats } from "./routes/Stats.tsx";
import { NotFound } from "./routes/NotFound.tsx";

export const router = createBrowserRouter([
  {
    path: "*",
    Component: NotFound,
  },
  {
    path: "/",
    Component: App,
  },
  {
    path: "/about",
    Component: About,
  },
  {
    Component: AppLayout,
    children: [
      {
        path: "/applications",
        Component: Applications,
        handle: { crumb: "Applications" },
      },
      {
        path: "/stats",
        Component: Stats,
        handle: { crumb: "Stats" },
      },
    ],
  },
]);
