import React, { useState, useRef, useEffect } from "react";
import { Calendar, CalendarDays } from "lucide-react";
import { format } from "date-fns";
import PriorityDropdown from "../components/PriorityDropdown";
import StatusDropdown from "../components/StatusDropdown";
import MembersDropdown from "../components/MembersDropdown";
import DatePicker from "../components/DatePicker";
import LabelSelector from "../components/LabelSelector";
import DependencySelector from "../components/DependencySelector";
import MilestoneModal from "../components/MilestoneModal";

const NewProjectForm = ({ onSave, onClose }) => {
  const [milestones, setMilestones] = useState([]);
  const [showMilestoneModal, setShowMilestoneModal] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const formRef = useRef();
  const dropdownRef = useRef(null);

  const [project, setProject] = useState({
    name: "",
    summary: "",
    description: "",
    status: "Backlog",
    priority: "No priority",
    assignee: "romi.indan",
    members: [],
    startDate: null,
    targetDate: null,
    labels: "",
    dependencies: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProject((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { ...project, milestones };
    onSave && onSave(payload);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        ref={formRef}
        className="bg-white shadow-lg rounded-md w-full max-w-4xl p-6 space-y-4 overflow-y-auto max-h-[90vh]"
      >
        {/* Header */}
        <div className="flex justify-between items-center font-semibold text-gray-800">
          <div className="text-sm text-gray-500"><span className="border rounded-md px-1">STU</span> &rsaquo; New project</div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-black text-xl focus:outline-none border-none"
          >
            &times;
          </button>
        </div>

        {/* Project Name */}
        <input
          type="text"
          name="name"
          value={project.name}
          onChange={handleChange}
          placeholder="Project name"
          className="w-full text-2xl font-semibold focus:outline-none placeholder-gray-400"
          required
        />

        {/* Summary */}
        <input
          type="text"
          name="summary"
          value={project.summary}
          onChange={handleChange}
          placeholder="Add a short summary..."
          className="w-full text-gray-500 focus:outline-none border-none placeholder-gray-400"
        />

        {/* Tag Buttons / Pills */}
        <div className="flex flex-wrap gap-2 mt-4">
          {/* Status */}
          <StatusDropdown
            value={project.status}
            onChange={(val) => {
              setProject({ ...project, status: val });
              setOpenDropdown(null);
            }}
            open={openDropdown === "status"}
            setOpen={setOpenDropdown}
            ref={openDropdown === "status" ? dropdownRef : null}
          />

          {/* Priority */}
          <PriorityDropdown
            value={project.priority}
            onChange={(val) => {
              setProject({ ...project, priority: val });
              setOpenDropdown(null);
            }}
            open={openDropdown === "priority"}
            setOpen={() =>
              setOpenDropdown(openDropdown === "priority" ? null : "priority")
            }
            ref={openDropdown === "priority" ? dropdownRef : null}
          />

          {/* Assignee (Fixed pill) */}
          <div className="px-3 py-1 rounded-lg border-gray-300 border text-sm bg-gray-100 flex items-center gap-2">
            <img
              src="https://i.pravatar.cc/24?u=romi"
              alt="user"
              className="w-5 h-5 rounded-full"
            />
            <span>{project.assignee}</span>
          </div>

          {/* Members */}
          <MembersDropdown
            selectedMembers={project.members}
            onChange={(members) => setProject({ ...project, members })}
            open={openDropdown === "members"}
            setOpen={setOpenDropdown}
            ref={openDropdown === "members" ? dropdownRef : null}
          />

          {/* Start Date */}
          <DatePicker
            label="Start"
            icon={Calendar}
            value={project.startDate}
            onChange={(date) => setProject({ ...project, startDate: date })}
            open={openDropdown === "start"}
            setOpen={setOpenDropdown}
            ref={openDropdown === "start" ? dropdownRef : null}
          />

          {/* Target Date */}
          <DatePicker
            label="Target"
            icon={CalendarDays}
            value={project.targetDate}
            onChange={(date) => setProject({ ...project, targetDate: date })}
            open={openDropdown === "target"}
            setOpen={setOpenDropdown}
            ref={openDropdown === "target" ? dropdownRef : null}
          />

          {/* Labels & Dependencies */}
          <LabelSelector
            selected={project.labels}
            onChange={(labels) => setProject({ ...project, labels })}
            open={openDropdown === "labels"}
            setOpen={setOpenDropdown}
            ref={openDropdown === "labels" ? dropdownRef : null}
          />

          <DependencySelector
            selected={project.dependencies}
            onChange={(deps) => setProject({ ...project, dependencies: deps })}
            open={openDropdown === "dependencies"}
            setOpen={setOpenDropdown}
            ref={openDropdown === "dependencies" ? dropdownRef : null}
          />
        </div>

        {/* Description */}
        <textarea
          name="description"
          value={project.description}
          onChange={handleChange}
          rows="10"
          placeholder="Write a description, a project brief, or collect ideas..."
          className="w-full border border-gray-200 rounded text-sm focus:outline-none border-none"
        />

        {/* Milestones header */}
        <div className="flex justify-between items-center bg-gray-100 px-3 py-1.5 rounded-md border-2 border-gray-200">
          <div className="text-sm text-gray-700 font-medium">Milestones</div>
          <button
            type="button"
            onClick={() => {
              setShowMilestoneModal(true);
              setOpenDropdown(null);
            }}
            className="text-lg p-0 text-gray-600 hover:text-black hover:text-black-200 border-none rounded-full focus:outline-none focus:ring-0 active:outline-none active:ring-0 active:border-none"
            title="Add milestone"
          >
            +
          </button>
        </div>

        {/* Milestone list */}
        {milestones.length > 0 && (
          <div className="mt-3 space-y-2">
            {milestones.map((m, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center p-2 bg-gray-50 border border-gray-200 rounded-md shadow-sm hover:shadow-md transition-all"
              >
                {/* Left: Name + Description */}
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-sm font-semibold text-gray-800 whitespace-nowrap">
                    {m.name}
                  </span>
                  {m.description && (
                    <span className="text-gray-500 text-sm truncate">
                      — {m.description}
                    </span>
                  )}
                </div>

                {/* Right: Target Date */}
                <div className="text-xs text-gray-400 whitespace-nowrap pl-4">
                  {format(new Date(m.targetDate), "dd MMM yyyy")}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer buttons */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Create project
          </button>
        </div>
      </form>

      {/* Milestone modal */}
      {showMilestoneModal && (
        <MilestoneModal
          onClose={() => setShowMilestoneModal(false)}
          onAdd={(milestone) => {
            setMilestones([...milestones, milestone]);
            setShowMilestoneModal(false);
          }}
        />
      )}
    </div>
  );
};

export default NewProjectForm;
