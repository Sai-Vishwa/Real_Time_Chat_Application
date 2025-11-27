import Avatar from "../UI/Avatar";

const UserItem = ({ user, onClick }) => (
  <div
    onClick={onClick}
    className="flex items-center gap-3 p-3 hover:bg-slate-800/50 rounded-xl cursor-pointer transition-all duration-200 group"
  >
    <Avatar avatar={user.avatar} online={user.online} size="md" />
    <div className="flex-1">
      <div className="font-medium text-slate-200 group-hover:text-blue-400 transition-colors">{user.name}</div>
      <div className="text-sm text-slate-500">{user.online ? 'Online' : 'Offline'}</div>
    </div>
  </div>
);

export default UserItem