import { ArrowLeft, Bot, MoreVertical, Phone, Video } from "lucide-react";
import Avatar from "../UI/Avatar";

const ChatHeader = ({ chat , onBack }) => {
  
  return (
    <div className="p-4 border-b border-slate-800/50 bg-slate-900/50 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="md:hidden p-2 hover:bg-slate-800/50 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-400" />
          </button>
          <Avatar
            avatar={chat.avatar}
            online={!chat.isGroup && chat.online}
            isBot={chat.isBot}
            isGroup={chat.isGroup}
            size="md"
          />
          <div>
            <h2 className="font-semibold text-slate-200 flex items-center gap-2">
              {chat.name}
              {chat.isBot && <Bot className="w-4 h-4 text-purple-400" />}
            </h2>
            <p className="text-sm text-slate-500">
              {chat.isBot ? 'AI Assistant - Always active' :
               chat.isGroup ? `${chat.members} members` :
               chat.online ? 'Online' : 'Offline'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-slate-800/50 rounded-xl transition-colors">
            <Phone className="w-5 h-5 text-slate-400" />
          </button>
          <button className="p-2 hover:bg-slate-800/50 rounded-xl transition-colors">
            <Video className="w-5 h-5 text-slate-400" />
          </button>
          <button className="p-2 hover:bg-slate-800/50 rounded-xl transition-colors">
            <MoreVertical className="w-5 h-5 text-slate-400" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader