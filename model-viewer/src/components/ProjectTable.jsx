import React from "react";
import { format } from "date-fns";

const ProjectTable = ({ projects, handleDeleteProject }) => {
  const projectKeys = [
    "name",
    "summary",
    "description",
    "status",
    "priority",
    "assignee",
    "members",
    "startDate",
    "targetDate",
    "labels",
    "dependencies",
    "milestones", // add milestone column
  ];

  return (
    <table className="w-full border border-gray-200 bg-white rounded shadow-sm">
      <thead className="bg-gray-100 border-b border-gray-200">
        <tr>
          <th className="text-left p-3 text-sm font-medium text-gray-600">#</th>
          {projectKeys.map((key) => (
            <th
              key={key}
              className="text-left p-3 text-sm font-medium text-gray-600 capitalize"
            >
              {key}
            </th>
          ))}
          <th className="p-3"></th>
        </tr>
      </thead>
      <tbody>
        {projects.map((p, idx) => (
          <tr
            key={idx}
            className="border-b border-gray-200 hover:bg-gray-50"
          >
            <td className="p-3 text-sm text-gray-700">{idx + 1}</td>
            {projectKeys.map((key) => (
              <td key={key} className="p-3 text-sm text-gray-600 align-top">
                {key === "startDate" || key === "targetDate"
                  ? p[key]
                    ? format(new Date(p[key]), "dd MMM yyyy")
                    : "-"
                  : Array.isArray(p[key])
                  ? key === "milestones"
                    ? p[key].length > 0
                      ? (
                        <ul className="space-y-1">
                          {p[key].map((m, i) => (
                            <li key={i} className="text-xs">
                              <span className="font-medium">{m.name}</span>
                              {m.targetDate && (
                                <span className="text-gray-500">
                                  {" "}
                                  ({format(new Date(m.targetDate), "dd MMM yyyy")})
                                </span>
                              )}
                            </li>
                          ))}
                        </ul>
                      )
                      : "-"
                    : p[key].join(", ")
                  : p[key] || "-"}
              </td>
            ))}
            <td className="p-3 text-right">
              <button
                onClick={() => handleDeleteProject(idx)}
                className="bg-white text-red-600 hover:underline text-sm"
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ProjectTable;