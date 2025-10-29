import { Paperclip, Send, Smile } from "lucide-react";
import MediaMenu from "../UI/MediaMenu";
import { useState } from "react";

const MessageInput = ({ onSendMessage, onMediaUpload }) => {
  const [message, setMessage] = useState('');
  const [showMediaMenu, setShowMediaMenu] = useState(false);

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleMedia = (type) => {
    onMediaUpload(type);
    setShowMediaMenu(false);
  };

  return (
    <div className="p-4 border-t border-slate-800/50 bg-slate-900/50 backdrop-blur-sm">
      <div className="flex items-end gap-2">
        <div className="relative">
          <button
            onClick={() => setShowMediaMenu(!showMediaMenu)}
            className="p-3 hover:bg-slate-800/50 rounded-xl transition-colors"
          >
            <Paperclip className="w-6 h-6 text-slate-400" />
          </button>
          {showMediaMenu && (
            <MediaMenu onSelect={handleMedia} />
          )}
        </div>
        <div className="flex-1 flex items-end gap-2 bg-slate-800/50 rounded-2xl px-4 py-2 border border-slate-700/50 focus-within:border-blue-500/50 transition-all">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
            placeholder="Type a message..."
            rows="1"
            className="flex-1 bg-transparent text-slate-200 placeholder-slate-500 focus:outline-none resize-none max-h-32"
          />
          <button className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors">
            <Smile className="w-5 h-5 text-slate-400" />
          </button>
        </div>
        <button
          onClick={handleSend}
          disabled={!message.trim()}
          className="p-3 bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-slate-700 disabled:to-slate-700 rounded-xl transition-all duration-200 disabled:cursor-not-allowed"
        >
          <Send className="w-6 h-6 text-white" />
        </button>
      </div>
    </div>
  );
};

export default MessageInput