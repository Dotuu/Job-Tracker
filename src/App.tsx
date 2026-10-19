import { ClerkLoaded, ClerkLoading } from "@clerk/react";
import "./App.css";
import { Skeleton } from "./components/ui/skeleton";
import { HomePage } from "./routes/HomePage";

function App() {
  return (
    <div className="home_root">
      <ClerkLoading>
        <Skeleton className="h-11 w-24 rounded-md" />
      </ClerkLoading>

      <ClerkLoaded>
        <HomePage />
      </ClerkLoaded>
    </div>
  );
}

export default App;
