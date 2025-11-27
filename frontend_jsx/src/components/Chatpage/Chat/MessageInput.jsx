import { Paperclip, Send, Smile, X, FileText, Image } from "lucide-react";
import { useState, useRef } from "react";

// MediaMenu Component
const MediaMenu = ({ onSelect, onClose }) => {
  const imageInputRef = useRef(null);
  const pdfInputRef = useRef(null);

  const handleImageClick = () => {
    imageInputRef.current?.click();
  };

  const handlePdfClick = () => {
    pdfInputRef.current?.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onSelect('image', file);
      e.target.value = '';
      onClose();
    }
  };

  const handlePdfChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onSelect('pdf', file);
      e.target.value = '';
      onClose();
    }
  };

  return (
    <>
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="hidden"
      />
      <input
        ref={pdfInputRef}
        type="file"
        accept=".pdf,application/pdf"
        onChange={handlePdfChange}
        className="hidden"
      />
      <div className="absolute bottom-full mb-2 left-0 bg-slate-800 rounded-xl shadow-2xl border border-slate-700 overflow-hidden z-50 min-w-[200px]">
        <div className="flex items-center justify-between px-4 py-2 border-b border-slate-700">
          <span className="text-sm font-medium text-slate-300">Upload File</span>
          <button onClick={onClose} className="p-1 hover:bg-slate-700 rounded-lg transition-colors">
            <X className="w-4 h-4 text-slate-400" />
          </button>
        </div>
        <button
          onClick={handleImageClick}
          className="flex items-center gap-3 px-4 py-3 hover:bg-slate-700 transition-colors w-full text-left border-b border-slate-700/50"
        >
          <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
            <Image className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <div className="text-slate-200 font-medium">Image</div>
            <div className="text-xs text-slate-500">JPG, PNG, GIF, WebP</div>
          </div>
        </button>
        <button
          onClick={handlePdfClick}
          className="flex items-center gap-3 px-4 py-3 hover:bg-slate-700 transition-colors w-full text-left"
        >
          <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center">
            <FileText className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <div className="text-slate-200 font-medium">PDF Document</div>
            <div className="text-xs text-slate-500">PDF files only</div>
          </div>
        </button>
      </div>
    </>
  );
};

// EmojiPicker Component
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

// MessageInput Component with File Preview
const MessageInput = ({ onSendMessage, onMediaUpload }) => {
  const [message, setMessage] = useState('');
  const [showMediaMenu, setShowMediaMenu] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [attachedFile, setAttachedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);

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
    if (attachedFile || message?.trim()) {
      onSendMessage({
        text: message,
        file: attachedFile,
        filePreview: filePreview 
      });
      setMessage('');
      setAttachedFile(null);
      setFilePreview(null);
    }
  };

  const handleMedia = (type, file) => {
    setAttachedFile({ type, file });
    
    // Create preview for images
    if (type === 'image') {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setFilePreview(null);
    }
    
    // Also notify parent
    if (onMediaUpload) {
      onMediaUpload(type, file);
    }
    
    setShowMediaMenu(false);
  };

  const handleRemoveFile = () => {
    setAttachedFile(null);
    setFilePreview(null);
  };

  const handleEmojiSelect = (emoji) => {
    setMessage(prev => prev + emoji);
  };

  return (
    <div className="p-4 border-t border-slate-800/50 bg-slate-900/50 backdrop-blur-sm">
      {/* File Preview */}
      {attachedFile && (
        <div className="mb-3 p-3 bg-slate-800/50 rounded-xl border border-slate-700/50 flex items-center gap-3">
          {attachedFile.type === 'image' && filePreview ? (
            <img src={filePreview} alt="Preview" className="w-16 h-16 object-cover rounded-lg" />
          ) : (
            <div className="w-16 h-16 bg-red-500/20 rounded-lg flex items-center justify-center">
              <FileText className="w-8 h-8 text-red-400" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="text-slate-200 font-medium truncate">{attachedFile.file.name}</div>
            <div className="text-xs text-slate-500">
              {(attachedFile.file.size / 1024).toFixed(1)} KB
            </div>
          </div>
          <button
            onClick={handleRemoveFile}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>
      )}

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
          disabled={!attachedFile && !message?.trim()}
          className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-slate-700 disabled:to-slate-700 rounded-xl transition-all duration-200 disabled:cursor-not-allowed"
        >
          <Send className="w-6 h-6 text-white" />
        </button>
      </div>
    </div>
  );
};

export default MessageInput

// Demo Component
// export default function Demo() {
//   const [messages, setMessages] = useState([]);

//   const handleSendMessage = (messageData) => {
//     console.log('Message sent:', messageData);
//     setMessages(prev => [...prev, messageData]);
//   };

//   const handleMediaUpload = (type, file) => {
//     console.log('Media uploaded:', type, file);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col">
//       <div className="flex-1 p-6 overflow-y-auto">
//         <div className="max-w-4xl mx-auto space-y-4">
//           <h2 className="text-2xl font-bold text-slate-200 mb-6">Message Input Demo</h2>
          
//           {messages.length === 0 ? (
//             <div className="text-center text-slate-500 py-12">
//               No messages yet. Try sending a message with text, images, or PDFs!
//             </div>
//           ) : (
//             messages.map((msg, idx) => (
//               <div key={idx} className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
//                 {msg.file && (
//                   <div className="mb-3">
//                     {msg.file.type === 'image' && msg.filePreview ? (
//                       <img src={msg.filePreview} alt="Uploaded" className="max-w-md rounded-lg" />
//                     ) : (
//                       <div className="flex items-center gap-3 p-3 bg-slate-900/50 rounded-lg">
//                         <FileText className="w-8 h-8 text-red-400" />
//                         <div>
//                           <div className="text-slate-200 font-medium">{msg.file.file.name}</div>
//                           <div className="text-xs text-slate-500">{(msg.file.file.size / 1024).toFixed(1)} KB</div>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 )}
//                 {msg.text && <p className="text-slate-200">{msg.text}</p>}
//               </div>
//             ))
//           )}
//         </div>
//       </div>
      
//       <div className="max-w-4xl mx-auto w-full">
//         <MessageInput onSendMessage={handleSendMessage} onMediaUpload={handleMediaUpload} />
//       </div>
//     </div>
//   );
// }