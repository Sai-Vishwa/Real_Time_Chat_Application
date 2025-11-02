import React, { useState , useEffect } from 'react';
import Sidebar from '../components/Chatpage/SideBar/SideBar';
import EmptyState from '../components/Chatpage/EmptyState';
import ChatView from '../components/Chatpage/Chat/ChatView';
import NewGroup from '../components/Chatpage/Group/NewGroup';

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
    <div className="h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
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

export default App;