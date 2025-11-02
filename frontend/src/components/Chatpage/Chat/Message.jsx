import { Check, CheckCheck, FileText, Film, Image } from "lucide-react";

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
        <div className={`rounded-2xl overflow-hidden ${
          message.self
            ? 'bg-linear-to-r from-blue-500 to-blue-600 text-white rounded-br-md'
            : message.isBot
            ? 'bg-linear-to-r from-purple-500/20 to-pink-500/20 text-slate-200 border border-purple-500/30 rounded-bl-md'
            : 'bg-slate-800/50 text-slate-200 rounded-bl-md'
        }`}>
          {message.loading ? (
            <div className="px-4 py-3 flex items-center gap-3">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Uploading image...</span>
            </div>
          ) : (
            <>
              {message.media === 'image' && message.imageUrl && (
                <div className="relative">
                  <img 
                    src={message.imageUrl} 
                    alt={message.fileName || 'Uploaded image'}
                    className="w-full h-auto max-h-80 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                  />
                  <div className={`absolute bottom-0 left-0 right-0 px-3 py-2 bg-linear-to-t ${
                    message.self ? 'from-blue-600/90' : 'from-slate-900/90'
                  } to-transparent`}>
                    <div className="flex items-center gap-2">
                      <Image className="w-3 h-3" />
                      <span className="text-xs truncate">{message.fileName}</span>
                    </div>
                  </div>
                </div>
              )}
              {message.media && message.media !== 'image' && (
                <div className="px-4 py-3">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-700/30">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      message.media === 'video' ? 'bg-purple-500/20' : 'bg-green-500/20'
                    }`}>
                      {message.media === 'video' && <Film className="w-4 h-4 text-purple-400" />}
                      {message.media === 'document' && <FileText className="w-4 h-4 text-green-400" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`text-sm font-medium truncate ${message.self ? 'text-white' : 'text-slate-200'}`}>
                        {message.fileName || `${message.media} file`}
                      </div>
                      {message.fileSize && (
                        <div className={`text-xs ${message.self ? 'text-blue-100' : 'text-slate-500'}`}>
                          {message.fileSize}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
              {message.text && !message.imageUrl && (
                <div className="px-4 py-3">
                  <p className="wrap-break-word">{message.text}</p>
                </div>
              )}
              <div className={`flex items-center gap-1 justify-end px-3 ${message.imageUrl ? 'pb-2' : 'pb-1'} ${message.text && !message.imageUrl ? '' : 'mt-1'}`}>
                <span className={`text-xs ${message.self ? 'text-blue-100' : 'text-slate-500'}`}>
                  {message.time}
                </span>
                {message.self && (
                  message.read ? <CheckCheck className="w-4 h-4 text-blue-200" /> : <Check className="w-4 h-4 text-blue-200" />
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};


export default Message;