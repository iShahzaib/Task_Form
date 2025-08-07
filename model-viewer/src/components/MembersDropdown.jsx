import React from "react";
import { UserPlus } from "lucide-react";

const allUsers = [
  {
    id: 1,
    name: "romi.indan",
    role: "Project lead",
    avatar: "https://i.pravatar.cc/24?u=romi",
  },
  {
    id: 2,
    name: "shahzaib.hussain",
    role: "Developer",
    avatar: "https://i.pravatar.cc/24?u=shahzaib",
  },
  {
    id: 3,
    name: "pratibha.k",
    role: "Designer",
    avatar: "https://i.pravatar.cc/24?u=pratibha",
  },
];

function MembersDropdown({ selectedMembers, onChange, open, setOpen }) {
  const toggleMember = (memberId) => {
    if (selectedMembers.includes(memberId)) {
      onChange(selectedMembers.filter((id) => id !== memberId));
    } else {
      onChange([...selectedMembers, memberId]);
    }
  };

  return (
    <div className="relative inline-block text-left">
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setOpen(open ? null : "members")}
        className="inline-flex items-center gap-2 px-3 py-1 border rounded-full text-sm bg-white hover:bg-gray-50 shadow-sm"
      >
        <UserPlus className="w-4 h-4" />
        Members
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-10 mt-2 w-64 rounded-md shadow-lg bg-white border p-2">
          {allUsers.map((user) => (
            <label
              key={user.id}
              className="flex items-center gap-3 px-2 py-2 hover:bg-gray-100 rounded cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedMembers.includes(user.id)}
                onChange={() => toggleMember(user.id)}
                className="accent-blue-600"
              />
              <img
                src={user.avatar}
                alt={user.name}
                className="w-6 h-6 rounded-full"
              />
              <div className="text-sm">
                <div className="font-medium text-gray-800">{user.name}</div>
                <div className="text-xs text-gray-500">{user.role}</div>
              </div>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

export default MembersDropdown;
