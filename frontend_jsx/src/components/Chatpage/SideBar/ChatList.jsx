import { User, Users } from "lucide-react";
import ChatItem from "./ChatItem";
import UserItem from "./UserItem";

const ChatList = ({ chats, users, selectedChat, searchQuery, onChatSelect, onUserChat }) => {
  
  return (
    <div className="flex-1 overflow-y-auto">
      {searchQuery && users.length > 0 && (
        <div className="p-4 border-b border-slate-800/50">
          <div className="text-xs font-semibold text-slate-500 mb-2 flex items-center gap-2">
            <User className="w-3 h-3" />
            USERS
          </div>
          {users.map(user => (
            <UserItem key={user.id} user={user} onClick={() => onUserChat(user)} />
          ))}
        </div>
      )}

      {searchQuery && chats.length > 0 && (
        <div className="text-xs font-semibold text-slate-500 px-4 pt-4 pb-2 flex items-center gap-2">
          <Users className="w-3 h-3" />
          CHATS
        </div>
      )}

      {chats.map(chat => (
        <ChatItem
          key={chat.id}
          chat={chat}
          isSelected={selectedChat?.id === chat.id}
          onClick={() => onChatSelect(chat)}
        />
      ))}
    </div>
  );
};


export default ChatList