import React, { useState } from "react";
import "./App.css";
import NewProjectForm from "./pages/NewProjectForm";
import ProjectTable from "./components/ProjectTable";

export default function App() {
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);

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
