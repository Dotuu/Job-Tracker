import { createBrowserRouter } from "react-router";
import App from "./App.tsx";
import { About } from "./routes/About.tsx";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
  },
  // {
  //   path: "/applications",
  //   Component: Applications,
  //   loader: loadApplicationData,
  // },
  {
    path: "/about",
    Component: About,
  },
]);
