import { ArrowLeft } from "lucide-react";
import GroupForm from "./GroupForm";
import MemberSelector from "./MemberSelector";
import { useState } from "react";

// components/Group/NewGroup.jsx
const NewGroup = ({ allUsers, onBack, onCreate }) => {
  const [groupName, setGroupName] = useState('');
  const [selectedMembers, setSelectedMembers] = useState([]);

  const toggleMember = (userId) => {
    setSelectedMembers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleCreate = () => {
    onCreate(groupName, selectedMembers);
    setGroupName('');
    setSelectedMembers([]);
  };

  return (
    <div className="flex-1 flex flex-col">
      <div className="p-4 border-b border-slate-800/50 bg-slate-900/50 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-slate-800/50 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-400" />
          </button>
          <h2 className="text-xl font-bold text-slate-200">New Group</h2>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-2xl mx-auto space-y-6">
          <GroupForm groupName={groupName} onChange={setGroupName} />
          <MemberSelector
            users={allUsers}
            selectedMembers={selectedMembers}
            onToggle={toggleMember}
          />
          <button
            onClick={handleCreate}
            disabled={!groupName.trim() || selectedMembers.length === 0}
            className="w-full py-4 bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-slate-700 disabled:to-slate-700 text-white font-semibold rounded-xl transition-all duration-200 disabled:cursor-not-allowed"
          >
            Create Group
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewGroup;