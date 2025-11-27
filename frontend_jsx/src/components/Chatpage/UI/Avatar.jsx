import { Bot } from "lucide-react";


const Avatar = ({ avatar  , online, isBot, isGroup}) => {
  
  const sizes = {
    sm: 'w-10 h-10 text-xl',
    md: 'w-12 h-12 text-2xl',
    lg: 'w-14 h-14 text-2xl'
  };

  return (
    <div className="relative">
      <div className={`${sizes["md"]} rounded-full flex items-center justify-center ${
        isBot ? 'bg-linear-to-br from-purple-500 to-pink-500' :
        isGroup ? 'bg-linear-to-br from-cyan-500 to-blue-500' :
        'bg-linear-to-br from-blue-500 to-purple-500'
      }`}>
        {avatar}
      </div>
      {!isGroup && online && (
        <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-900"></div>
      )}
      {isBot && (
        <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-purple-500 rounded-full border-2 border-slate-900 flex items-center justify-center">
          <Bot className="w-2.5 h-2.5 text-white" />
        </div>
      )}
    </div>
  );
};

export default Avatar;