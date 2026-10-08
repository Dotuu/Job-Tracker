import { createBrowserRouter } from "react-router";
import App from "./App.tsx";
import { About } from "./routes/About.tsx";
import { Applications } from "./routes/Applications.tsx";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
  },
  {
    path: "/applications",
    Component: Applications,
  },
  {
    path: "/about",
    Component: About,
  },
]);
