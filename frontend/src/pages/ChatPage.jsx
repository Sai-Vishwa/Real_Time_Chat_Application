import React, { useState } from 'react';
import { 
  Search , Plus , User , Users , ArrowLeft, Phone, 
  Video, MoreVertical, Bot , Check, CheckCheck, Image, Film, FileText,
  Paperclip, Smile, Send,
  X
 } from 'lucide-react';

const App = () => {
  const [view, setView] = useState('chats');
  const [selectedChat, setSelectedChat] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const aiBot = {
    id: 'ai-bot',
    name: 'AI Assistant',
    avatar: '🤖',
    online: true,
    isBot: true,
    lastMessage: 'How can I help you today?',
    time: 'now',
    unread: 0
  };

  const [chats, setChats] = useState([
    aiBot,
    { id: 1, name: 'Design Team', avatar: '🎨', online: true, isGroup: true, members: 12, lastMessage: 'New mockups are ready!', time: '2m', unread: 3 },
    { id: 2, name: 'Sarah Chen', avatar: '👩‍💼', online: true, lastMessage: 'Thanks for the update', time: '5m', unread: 0 },
    { id: 3, name: 'Dev Squad', avatar: '💻', online: false, isGroup: true, members: 8, lastMessage: 'Deployment successful', time: '1h', unread: 0 },
    { id: 4, name: 'Michael Ross', avatar: '👨‍🔬', online: false, lastMessage: 'See you tomorrow', time: '3h', unread: 0 },
    { id: 5, name: 'Marketing Hub', avatar: '📱', online: true, isGroup: true, members: 15, lastMessage: 'Campaign starts Monday', time: '5h', unread: 1 },
  ]);

  const [messages, setMessages] = useState({
    1: [
      { id: 1, sender: 'Alex Kim', text: 'Check out the new design concept', time: '10:30', read: true, self: false },
      { id: 2, sender: 'You', text: 'Looks amazing! Love the color palette', time: '10:32', read: true, self: true },
      { id: 3, sender: 'Sarah Chen', text: 'Agreed! The gradient is perfect', time: '10:33', read: true, self: false },
      { 
        id: 4, 
        sender: 'Alex Kim', 
        text: 'design-mockup.png', 
        time: '10:35', 
        read: true, 
        self: false, 
        media: 'image', 
        fileName: 'design-mockup.png',
        imageUrl: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Cdefs%3E%3ClinearGradient id="grad" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%234f46e5;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%239333ea;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="400" height="300" fill="url(%23grad)"/%3E%3Ctext x="50%25" y="45%25" dominant-baseline="middle" text-anchor="middle" font-family="Arial, sans-serif" font-size="32" fill="white" font-weight="bold"%3EDesign Mockup%3C/text%3E%3Ctext x="50%25" y="55%25" dominant-baseline="middle" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" fill="rgba(255,255,255,0.8)"%3EUI/UX Concept%3C/text%3E%3C/svg%3E'
      },
    ],
    'ai-bot': [
      { id: 1, sender: 'AI Assistant', text: 'Hello! I\'m your AI assistant. I can help you with questions, provide information, or just chat. How can I assist you today?', time: '09:00', read: true, self: false, isBot: true },
    ]
  });

  const allUsers = [
    { id: 6, name: 'Emma Wilson', avatar: '👩‍🎨', online: true },
    { id: 7, name: 'James Lee', avatar: '👨‍💻', online: false },
    { id: 8, name: 'Olivia Brown', avatar: '👩‍🔬', online: true },
    { id: 9, name: 'Noah Davis', avatar: '👨‍🎤', online: true },
    { id: 10, name: 'Sophia Martinez', avatar: '👩‍🏫', online: false },
  ];

  const handleSendMessage = (message) => {
    if (!message.trim() || !selectedChat) return;

    const newMsg = {
      id: Date.now(),
      sender: 'You',
      text: message,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
      read: false,
      self: true
    };

    setMessages(prev => ({
      ...prev,
      [selectedChat.id]: [...(prev[selectedChat.id] || []), newMsg]
    }));

    if (selectedChat.isBot) {
      setTimeout(() => {
        const aiResponse = {
          id: Date.now() + 1,
          sender: 'AI Assistant',
          text: `I received your message: "${message}". As a demo AI, I'm here to assist you with any questions!`,
          time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
          read: true,
          self: false,
          isBot: true
        };
        setMessages(prev => ({
          ...prev,
          [selectedChat.id]: [...(prev[selectedChat.id] || []), aiResponse]
        }));
      }, 1000);
    }
  };

  const handleMediaUpload = async (type, file) => {
    if (!selectedChat || !file) return;
    
    // Create loading message
    const loadingMsg = {
      id: Date.now(),
      sender: 'You',
      text: 'Uploading...',
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
      read: false,
      self: true,
      media: type,
      loading: true
    };

    setMessages(prev => ({
      ...prev,
      [selectedChat.id]: [...(prev[selectedChat.id] || []), loadingMsg]
    }));

    // Convert image to base64 using canvas
    const reader = new FileReader();
    reader.onload = async (e) => {
      const img = new Image();
      img.onload = async () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Set canvas size to image size (with max width/height)
        const maxWidth = 800;
        const maxHeight = 600;
        let width = img.width;
        let height = img.height;
        
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
        
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        
        const imageDataUrl = canvas.toDataURL('image/jpeg', 0.9);
        
        // Simulate upload delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Replace loading message with actual message
        const mediaMsg = {
          id: loadingMsg.id,
          sender: 'You',
          text: file.name,
          time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
          read: false,
          self: true,
          media: type,
          fileName: file.name,
          fileSize: `${(file.size / 1024).toFixed(1)} KB`,
          imageUrl: type === 'image' ? imageDataUrl : null,
          loading: false
        };

        setMessages(prev => ({
          ...prev,
          [selectedChat.id]: prev[selectedChat.id].map(msg => 
            msg.id === loadingMsg.id ? mediaMsg : msg
          )
        }));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleCreateGroup = (groupName, selectedMembers) => {
    if (!groupName.trim() || selectedMembers.length === 0) return;

    const newGroup = {
      id: Date.now(),
      name: groupName,
      avatar: '👥',
      online: true,
      isGroup: true,
      members: selectedMembers.length,
      lastMessage: 'Group created',
      time: 'now',
      unread: 0
    };

    setChats(prev => [newGroup, ...prev]);
    setMessages(prev => ({
      ...prev,
      [newGroup.id]: [{
        id: 1,
        sender: 'System',
        text: `${groupName} was created`,
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
        read: true,
        self: false,
        system: true
      }]
    }));

    setView('chats');
  };

  const handleUserChat = (user) => {
    const existingChat = chats.find(c => c.id === user.id);
    if (existingChat) {
      setSelectedChat(existingChat);
      setView('chat');
    } else {
      const newChat = {
        ...user,
        lastMessage: 'Start chatting',
        time: 'now',
        unread: 0
      };
      setChats(prev => [newChat, ...prev]);
      setMessages(prev => ({ ...prev, [user.id]: [] }));
      setSelectedChat(newChat);
      setView('chat');
    }
    setSearchQuery('');
  };

  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
    setView('chat');
  };

  return (
    <div className="h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl h-[90vh] bg-slate-900/50 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-slate-800/50 flex">
        
        <Sidebar
          view={view}
          chats={chats}
          allUsers={allUsers}
          selectedChat={selectedChat}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onChatSelect={handleChatSelect}
          onUserChat={handleUserChat}
          onNewGroup={() => setView('newGroup')}
        />

        <div className="flex-1 flex flex-col">
          {view === 'chats' && !selectedChat && (
            <EmptyState
              icon={Users}
              title="Select a chat"
              description="Choose a conversation or start a new one"
            />
          )}

          {view === 'chat' && selectedChat && (
            <ChatView
              chat={selectedChat}
              messages={messages[selectedChat.id] || []}
              onBack={() => setView('chats')}
              onSendMessage={handleSendMessage}
              onMediaUpload={handleMediaUpload}
            />
          )}

          {view === 'newGroup' && (
            <NewGroup
              allUsers={allUsers}
              onBack={() => setView('chats')}
              onCreate={handleCreateGroup}
            />
          )}
        </div>
      </div>
    </div>
  );
};

// EmptyState Component
const EmptyState = ({ icon: Icon, title, description }) => (
  <div className="flex-1 flex items-center justify-center">
    <div className="text-center">
      <div className="w-32 h-32 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
        <Icon className="w-16 h-16 text-slate-600" />
      </div>
      <h2 className="text-2xl font-bold text-slate-300 mb-2">{title}</h2>
      <p className="text-slate-500">{description}</p>
    </div>
  </div>
);

export default App;

// ============================================
// SIDEBAR COMPONENTS
// ============================================

// components/Sidebar/Sidebar.jsx
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

// components/Sidebar/SidebarHeader.jsx
const SidebarHeader = ({ searchQuery, onSearchChange, onNewGroup }) => {
  
  return (
    <div className="p-4 border-b border-slate-800/50 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
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

// components/UI/SearchBar.jsx
const SearchBar = ({ value, onChange, placeholder }) => {
  
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:bg-slate-800/70 transition-all duration-200"
      />
    </div>
  );
};

// components/Sidebar/ChatList.jsx
const ChatList = ({ chats, users, selectedChat, searchQuery, onChatSelect, onUserChat }) => {
  
  return (
    <div className="flex-1 overflow-y-auto">
      {searchQuery && users.length > 0 && (
        <div className="p-4 border-b border-slate-800/50">
          <div className="text-xs font-semibold text-slate-500 mb-2 flex items-center gap-2">
            <User className="w-3 h-3" />
            USERS
          </div>
          {users.map(user => (
            <UserItem key={user.id} user={user} onClick={() => onUserChat(user)} />
          ))}
        </div>
      )}

      {searchQuery && chats.length > 0 && (
        <div className="text-xs font-semibold text-slate-500 px-4 pt-4 pb-2 flex items-center gap-2">
          <Users className="w-3 h-3" />
          CHATS
        </div>
      )}

      {chats.map(chat => (
        <ChatItem
          key={chat.id}
          chat={chat}
          isSelected={selectedChat?.id === chat.id}
          onClick={() => onChatSelect(chat)}
        />
      ))}
    </div>
  );
};

// components/Sidebar/UserItem.jsx
const UserItem = ({ user, onClick }) => (
  <div
    onClick={onClick}
    className="flex items-center gap-3 p-3 hover:bg-slate-800/50 rounded-xl cursor-pointer transition-all duration-200 group"
  >
    <Avatar avatar={user.avatar} online={user.online} size="md" />
    <div className="flex-1">
      <div className="font-medium text-slate-200 group-hover:text-blue-400 transition-colors">{user.name}</div>
      <div className="text-sm text-slate-500">{user.online ? 'Online' : 'Offline'}</div>
    </div>
  </div>
);

// components/Sidebar/ChatItem.jsx
const ChatItem = ({ chat, isSelected, onClick }) => {
  
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 p-4 cursor-pointer transition-all duration-200 border-l-4 ${
        isSelected
          ? 'bg-slate-800/70 border-blue-500'
          : 'border-transparent hover:bg-slate-800/30'
      }`}
    >
      <Avatar
        avatar={chat.avatar}
        online={!chat.isGroup && chat.online}
        isBot={chat.isBot}
        isGroup={chat.isGroup}
        size="lg"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-semibold text-slate-200 truncate flex items-center gap-2">
            {chat.name}
            {chat.isGroup && <span className="text-xs text-slate-500">({chat.members})</span>}
          </h3>
          <span className="text-xs text-slate-500">{chat.time}</span>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-400 truncate">{chat.lastMessage}</p>
          {chat.unread > 0 && (
            <span className="ml-2 px-2 py-0.5 bg-blue-500 text-white text-xs rounded-full font-medium">
              {chat.unread}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

// components/UI/Avatar.jsx
const Avatar = ({ avatar, online, isBot, isGroup, size = 'md' }) => {
  
  const sizes = {
    sm: 'w-10 h-10 text-xl',
    md: 'w-12 h-12 text-2xl',
    lg: 'w-14 h-14 text-2xl'
  };

  return (
    <div className="relative">
      <div className={`${sizes[size]} rounded-full flex items-center justify-center ${
        isBot ? 'bg-gradient-to-br from-purple-500 to-pink-500' :
        isGroup ? 'bg-gradient-to-br from-cyan-500 to-blue-500' :
        'bg-gradient-to-br from-blue-500 to-purple-500'
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

// ============================================
// CHAT COMPONENTS
// ============================================

// components/Chat/ChatView.jsx
const ChatView = ({ chat, messages, onBack, onSendMessage, onMediaUpload }) => (
  <>
    <ChatHeader chat={chat} onBack={onBack} />
    <MessageList messages={messages} isGroup={chat.isGroup} />
    <MessageInput onSendMessage={onSendMessage} onMediaUpload={onMediaUpload} />
  </>
);

// components/Chat/ChatHeader.jsx
const ChatHeader = ({ chat, onBack }) => {
  
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

// components/Chat/MessageList.jsx
const MessageList = ({ messages, isGroup }) => (
  <div className="flex-1 overflow-y-auto p-4 space-y-4">
    {messages.map(msg => (
      <Message key={msg.id} message={msg} isGroup={isGroup} />
    ))}
  </div>
);

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
        <div className={`rounded-2xl overflow-hidden ${
          message.self
            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-md'
            : message.isBot
            ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-slate-200 border border-purple-500/30 rounded-bl-md'
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
                  <div className={`absolute bottom-0 left-0 right-0 px-3 py-2 bg-gradient-to-t ${
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
                  <p className="break-words">{message.text}</p>
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
          className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-slate-700 disabled:to-slate-700 rounded-xl transition-all duration-200 disabled:cursor-not-allowed"
        >
          <Send className="w-6 h-6 text-white" />
        </button>
      </div>
    </div>
  );
};

// components/UI/EmojiPicker.jsx
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

// components/UI/MediaMenu.jsx
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

// ============================================
// GROUP COMPONENTS
// ============================================

// components/Group/NewGroup.jsx
const NewGroup = ({ allUsers, onBack, onCreate }) => {
  const [groupName, setGroupName] = useState('');
  const [selectedMembers, setSelectedMembers] = useState([]);

  const toggleMember = (userId) => {
    setSelectedMembers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleCreate = () => {
    onCreate(groupName, selectedMembers);
    setGroupName('');
    setSelectedMembers([]);
  };

  return (
    <div className="flex-1 flex flex-col">
      <div className="p-4 border-b border-slate-800/50 bg-slate-900/50 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-slate-800/50 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-400" />
          </button>
          <h2 className="text-xl font-bold text-slate-200">New Group</h2>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-2xl mx-auto space-y-6">
          <GroupForm groupName={groupName} onChange={setGroupName} />
          <MemberSelector
            users={allUsers}
            selectedMembers={selectedMembers}
            onToggle={toggleMember}
          />
          <button
            onClick={handleCreate}
            disabled={!groupName.trim() || selectedMembers.length === 0}
            className="w-full py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-slate-700 disabled:to-slate-700 text-white font-semibold rounded-xl transition-all duration-200 disabled:cursor-not-allowed"
          >
            Create Group
          </button>
        </div>
      </div>
    </div>
  );
};

// components/Group/GroupForm.jsx
const GroupForm = ({ groupName, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-slate-400 mb-2">Group Name</label>
    <input
      type="text"
      value={groupName}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Enter group name..."
      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500/50 transition-all"
    />
  </div>
);

// components/Group/MemberSelector.jsx
const MemberSelector = ({ users, selectedMembers, onToggle }) => {
  
  return (
    <div>
      <label className="block text-sm font-medium text-slate-400 mb-3">
        Add Members ({selectedMembers.length} selected)
      </label>
      <div className="space-y-2">
        {users.map(user => (
          <div
            key={user.id}
            onClick={() => onToggle(user.id)}
            className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all duration-200 ${
              selectedMembers.includes(user.id)
                ? 'bg-blue-500/20 border-2 border-blue-500'
                : 'bg-slate-800/30 border-2 border-transparent hover:bg-slate-800/50'
            }`}
          >
            <Avatar avatar={user.avatar} online={user.online} size="md" />
            <div className="flex-1">
              <div className="font-medium text-slate-200">{user.name}</div>
              <div className="text-sm text-slate-500">{user.online ? 'Online' : 'Offline'}</div>
            </div>
            {selectedMembers.includes(user.id) && (
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};