import { Paperclip, Send, Smile } from "lucide-react";
import MediaMenu from "../UI/MediaMenu";
import { useState } from "react";

// components/Chat/MessageInput.jsx
const MessageInput = ({ onSendMessage, onMediaUpload }) => {
  const [message, setMessage] = useState('');
  const [showMediaMenu, setShowMediaMenu] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const emojis = [
    '😀', '😃', '😄', '😁', '😅', '😂', '🤣', '😊', '😇', '🙂',
    '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋',
    '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳',
    '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '😣', '😖', '😫',
    '😩', '🥺', '😢', '😭', '😤', '😠', '😡', '🤬', '🤯', '😳',
    '🥵', '🥶', '😱', '😨', '😰', '😥', '😓', '🤗', '🤔', '🤭',
    '🤫', '🤥', '😶', '😐', '😑', '😬', '🙄', '😯', '😦', '😧',
    '👍', '👎', '👏', '🙌', '👐', '🤝', '🙏', '✌️', '🤞', '🤟',
    '🤘', '🤙', '💪', '🦾', '✍️', '🤳', '💅', '🦵', '🦿', '🦶',
    '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔',
    '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '☮️',
    '✨', '💫', '⭐', '🌟', '✴️', '⚡', '💥', '🔥', '🌈', '☀️',
  ];

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

  const handleEmojiSelect = (emoji) => {
    setMessage(prev => prev + emoji);
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
            <MediaMenu onSelect={handleMedia} onClose={() => setShowMediaMenu(false)} />
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
          <div className="relative">
            <button 
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
            >
              <Smile className="w-5 h-5 text-slate-400" />
            </button>
            {showEmojiPicker && (
              <EmojiPicker emojis={emojis} onSelect={handleEmojiSelect} onClose={() => setShowEmojiPicker(false)} />
            )}
          </div>
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


const EmojiPicker = ({ emojis, onSelect, onClose }) => {
  
  return (
    <div className="absolute bottom-full right-0 mb-2 bg-slate-800 rounded-xl shadow-2xl border border-slate-700 p-3 w-80 max-h-72 overflow-y-auto">
      <div className="flex items-center justify-between mb-2 sticky top-0 bg-slate-800 pb-2">
        <span className="text-sm font-medium text-slate-300">Emojis</span>
        <button onClick={onClose} className="p-1 hover:bg-slate-700 rounded-lg transition-colors">
          <X className="w-4 h-4 text-slate-400" />
        </button>
      </div>
      <div className="grid grid-cols-8 gap-2">
        {emojis.map((emoji, idx) => (
          <button
            key={idx}
            onClick={() => onSelect(emoji)}
            className="text-2xl hover:bg-slate-700 rounded-lg p-2 transition-all hover:scale-125"
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
};

export default {MessageInput , EmojiPicker}
