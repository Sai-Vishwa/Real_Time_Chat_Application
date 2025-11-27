import { Plus } from "lucide-react";
import ChatList from "./ChatList";
import SearchBar from "../UI/SearchBar";

const SidebarHeader = ({ searchQuery, onSearchChange, onNewGroup }) => {
  
  return (
    <div className="p-4 border-b border-slate-800/50 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Messages
        </h1>
        <button
          onClick={onNewGroup}
          className="p-2 hover:bg-slate-800/50 rounded-xl transition-all duration-200 group"
        >
          <Plus className="w-6 h-6 text-slate-400 group-hover:text-blue-400 transition-colors" />
        </button>
      </div>
      <SearchBar
        value={searchQuery}
        onChange={onSearchChange}
        placeholder="Search chats or users..."
      />
    </div>
  );
};

const Sidebar = ({ 
  view, 
  chats, 
  allUsers, 
  selectedChat, 
  searchQuery, 
  onSearchChange, 
  onChatSelect, 
  onUserChat, 
  onNewGroup 
}) => {
  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredUsers = allUsers.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`${view === 'chat' ? 'hidden md:flex' : 'flex'} w-full md:w-96 flex-col bg-slate-900/80 border-r border-slate-800/50`}>
      <SidebarHeader
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        onNewGroup={onNewGroup}
      />
      <ChatList
        chats={filteredChats}
        users={filteredUsers}
        selectedChat={selectedChat}
        searchQuery={searchQuery}
        onChatSelect={onChatSelect}
        onUserChat={onUserChat}
      />
    </div>
  );
};

export default Sidebar