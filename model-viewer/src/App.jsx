import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import NewProjectForm from "./pages/NewProjectForm";

function App() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <NewProjectForm />
    </div>
  );
}

export default App;
