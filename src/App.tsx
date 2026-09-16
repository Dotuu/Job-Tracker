import { Show } from "@clerk/react";
import "./App.css";

function App() {
  return (
    <header>
      <Show when="signed-in"></Show>
      <Show when="signed-out"></Show>
    </header>
  );
}

export default App;
