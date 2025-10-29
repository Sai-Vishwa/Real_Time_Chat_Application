import { FileText, Film, Image } from "lucide-react";

// components/UI/MediaMenu.jsx
const MediaMenu = ({ onSelect }) => {
  
  return (
    <div className="absolute bottom-full mb-2 left-0 bg-slate-800 rounded-xl shadow-2xl border border-slate-700 overflow-hidden">
      <button
        onClick={() => onSelect('image')}
        className="flex items-center gap-3 px-4 py-3 hover:bg-slate-700 transition-colors w-full text-left"
      >
        <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
          <Image className="w-5 h-5 text-blue-400" />
        </div>
        <span className="text-slate-200">Image</span>
      </button>
      <button
        onClick={() => onSelect('video')}
        className="flex items-center gap-3 px-4 py-3 hover:bg-slate-700 transition-colors w-full text-left"
      >
        <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
          <Film className="w-5 h-5 text-purple-400" />
        </div>
        <span className="text-slate-200">Video</span>
      </button>
      <button
        onClick={() => onSelect('document')}
        className="flex items-center gap-3 px-4 py-3 hover:bg-slate-700 transition-colors w-full text-left"
      >
        <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
          <FileText className="w-5 h-5 text-green-400" />
        </div>
        <span className="text-slate-200">Document</span>
      </button>
    </div>
  );
};


export default MediaMenu