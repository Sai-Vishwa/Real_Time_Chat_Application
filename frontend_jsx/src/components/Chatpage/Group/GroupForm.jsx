const GroupForm = ({ groupName, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-slate-400 mb-2">Group Name</label>
    <input
      type="text"
      value={groupName}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Enter group name..."
      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500/50 transition-all"
    />
  </div>
);

export default GroupForm