import Avatar from "../UI/Avatar";

const ChatItem = ({ chat, isSelected, onClick }) => {
  
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 p-4 cursor-pointer transition-all duration-200 border-l-4 ${
        isSelected
          ? 'bg-slate-800/70 border-blue-500'
          : 'border-transparent hover:bg-slate-800/30'
      }`}
    >
      <Avatar
        avatar={chat.avatar}
        online={!chat.isGroup && chat.online}
        isBot={chat.isBot}
        isGroup={chat.isGroup}
        size="lg"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-semibold text-slate-200 truncate flex items-center gap-2">
            {chat.name}
            {chat.isGroup && <span className="text-xs text-slate-500">({chat.members})</span>}
          </h3>
          <span className="text-xs text-slate-500">{chat.time}</span>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-400 truncate">{chat.lastMessage}</p>
          {chat.unread > 0 && (
            <span className="ml-2 px-2 py-0.5 bg-blue-500 text-white text-xs rounded-full font-medium">
              {chat.unread}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatItem;

