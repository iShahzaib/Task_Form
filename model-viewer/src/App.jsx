import React, { useState, useEffect } from "react";
import "./App.css";
import NewProjectForm from "./pages/NewProjectForm";
import ProjectTable from "./components/ProjectTable";

export default function App() {
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false); // ✅ prevent early overwrite

  // Load projects from localStorage on first render
  useEffect(() => {
    const storedProjects = localStorage.getItem("projects");
    if (storedProjects) {
      const parsed = JSON.parse(storedProjects).map((p) => ({
        ...p,
        startDate: p.startDate ? new Date(p.startDate) : null,
        targetDate: p.targetDate ? new Date(p.targetDate) : null,
        milestones: p.milestones
          ? p.milestones.map((m) => ({
              ...m,
              targetDate: m.targetDate ? new Date(m.targetDate) : null,
            }))
          : [],
      }));
      setProjects(parsed);
    }
    setIsLoaded(true); // ✅ only after load
  }, []);

  // Save projects to localStorage whenever they change (but only after load)
  useEffect(() => {
    if (!isLoaded) return; // ✅ skip until loaded
    const serializableProjects = projects.map((p) => ({
      ...p,
      startDate: p.startDate ? p.startDate.toISOString() : null,
      targetDate: p.targetDate ? p.targetDate.toISOString() : null,
      milestones: p.milestones
        ? p.milestones.map((m) => ({
            ...m,
            targetDate: m.targetDate ? m.targetDate.toISOString() : null,
          }))
        : [],
    }));
    localStorage.setItem("projects", JSON.stringify(serializableProjects));
  }, [projects, isLoaded]);

  // Add project
  const handleAddProject = (newProject) => {
    setProjects((prev) => [...prev, newProject]);
    setShowForm(false);
  };

  // Delete project
  const handleDeleteProject = (index) => {
    setProjects((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Projects Dashboard
          </h1>
          <button
            onClick={() => setShowForm(true)}
            className="ml-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            + New Project
          </button>
        </div>

        {/* Projects list */}
        {projects.length === 0 ? (
          <div className="text-gray-500 text-sm">
            No projects found. Click "New Project" to add one.
          </div>
        ) : (
          <ProjectTable
            projects={projects}
            handleDeleteProject={handleDeleteProject}
          />
        )}

        {/* Modal */}
        {showForm && (
          <NewProjectForm
            onClose={() => setShowForm(false)}
            onSave={handleAddProject}
          />
        )}
      </div>
    </div>
  );
}
