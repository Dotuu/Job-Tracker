import { createBrowserRouter } from "react-router";
import App from "./App.tsx";
import { About } from "./routes/About.tsx";
import { Applications } from "./routes/Applications.tsx";
import { loadApplicationData } from "./lib/api.ts";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
  },
  {
    path: "/applications",
    Component: Applications,
    loader: loadApplicationData,
  },
  {
    path: "/about",
    Component: About,
  },
]);
