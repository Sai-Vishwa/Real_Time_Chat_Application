import { FileText, Film, Image } from "lucide-react";

const MediaMenu = ({ onSelect, onClose }) => {
  const fileInputRef = React.useRef(null);

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onSelect('image', file);
      e.target.value = '';
      onClose();
    }
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      <div className="absolute bottom-full mb-2 left-0 bg-slate-800 rounded-xl shadow-2xl border border-slate-700 overflow-hidden z-50 min-w-[200px]">
        <div className="flex items-center justify-between px-4 py-2 border-b border-slate-700">
          <span className="text-sm font-medium text-slate-300">Upload Image</span>
          <button onClick={onClose} className="p-1 hover:bg-slate-700 rounded-lg transition-colors">
            <X className="w-4 h-4 text-slate-400" />
          </button>
        </div>
        <button
          onClick={handleFileClick}
          className="flex items-center gap-3 px-4 py-3 hover:bg-slate-700 transition-colors w-full text-left"
        >
          <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
            <Image className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <div className="text-slate-200 font-medium">Image</div>
            <div className="text-xs text-slate-500">JPG, PNG, GIF, WebP</div>
          </div>
        </button>
      </div>
    </>
  );
};

export default MediaMenu