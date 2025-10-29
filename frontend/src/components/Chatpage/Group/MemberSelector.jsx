import { Check } from "lucide-react";
import Avatar from "../UI/Avatar";

// components/Group/MemberSelector.jsx
const MemberSelector = ({ users, selectedMembers, onToggle }) => {
  
  return (
    <div>
      <label className="block text-sm font-medium text-slate-400 mb-3">
        Add Members ({selectedMembers.length} selected)
      </label>
      <div className="space-y-2">
        {users.map(user => (
          <div
            key={user.id}
            onClick={() => onToggle(user.id)}
            className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all duration-200 ${
              selectedMembers.includes(user.id)
                ? 'bg-blue-500/20 border-2 border-blue-500'
                : 'bg-slate-800/30 border-2 border-transparent hover:bg-slate-800/50'
            }`}
          >
            <Avatar avatar={user.avatar} online={user.online} size="md" />
            <div className="flex-1">
              <div className="font-medium text-slate-200">{user.name}</div>
              <div className="text-sm text-slate-500">{user.online ? 'Online' : 'Offline'}</div>
            </div>
            {selectedMembers.includes(user.id) && (
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MemberSelector