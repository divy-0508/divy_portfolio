import { useState } from "react";
import { DataProvider } from "./hooks/useData";

import CursorTracker from "./components/CursorTracker";

import EmotionWelcome from "./components/EmotionWelcome";
import Home from "./pages/Home";
import ProjectDetail from "./pages/ProjectDetail";
import Admin from "./pages/Admin";

export default function App() {
  const [screen, setScreen] = useState("welcome"); // welcome | home | project | admin
  const [selectedProject, setSelectedProject] = useState(null);

  function handleProjectClick(project) {
    setSelectedProject(project);
    setScreen("project");
    window.scrollTo(0, 0);
  }

  return (
    <DataProvider>
      <CursorTracker />
      {screen === "welcome" && (
        <EmotionWelcome onEnter={() => setScreen("home")} />
      )}
      {screen === "home" && (
        <Home
          onProjectClick={handleProjectClick}
          onAdminClick={() => setScreen("admin")}
        />
      )}
      {screen === "project" && (
        <ProjectDetail
          project={selectedProject}
          onBack={() => { setScreen("home"); setTimeout(() => { document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" }); }, 100); }}
        />
      )}
      {screen === "admin" && (
        <Admin onBack={() => setScreen("home")} />
      )}
    </DataProvider>
  );
}
