import { Check, CheckCheck, FileText, Film, Image } from "lucide-react";

// components/Chat/Message.jsx
const Message = ({ message, isGroup }) => {
  
  if (message.system) {
    return (
      <div className="flex justify-center">
        <div className="px-4 py-2 bg-slate-800/30 rounded-full text-xs text-slate-500">
          {message.text}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex ${message.self ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-md ${message.self ? 'items-end' : 'items-start'} flex flex-col`}>
        {!message.self && isGroup && (
          <span className="text-xs text-slate-500 mb-1 px-3">{message.sender}</span>
        )}
        <div className={`px-4 py-3 rounded-2xl ${
          message.self
            ? 'bg-linear-to-r from-blue-500 to-blue-600 text-white rounded-br-md'
            : message.isBot
            ? 'bg-linear-to-r from-purple-500/20 to-pink-500/20 text-slate-200 border border-purple-500/30 rounded-bl-md'
            : 'bg-slate-800/50 text-slate-200 rounded-bl-md'
        }`}>
          {message.media && (
            <div className="flex items-center gap-2 mb-2">
              {message.media === 'image' && <Image className="w-4 h-4" />}
              {message.media === 'video' && <Film className="w-4 h-4" />}
              {message.media === 'document' && <FileText className="w-4 h-4" />}
            </div>
          )}
          <p className="wrap-break-word">{message.text}</p>
          <div className="flex items-center gap-1 justify-end mt-1">
            <span className={`text-xs ${message.self ? 'text-blue-100' : 'text-slate-500'}`}>
              {message.time}
            </span>
            {message.self && (
              message.read ? <CheckCheck className="w-4 h-4 text-blue-200" /> : <Check className="w-4 h-4 text-blue-200" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Message;