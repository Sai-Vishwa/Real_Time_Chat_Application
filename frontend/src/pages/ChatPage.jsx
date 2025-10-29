import React, { useState } from 'react';
import { 
  Search , Plus , User , Users , ArrowLeft, Phone, 
  Video, MoreVertical, Bot , Check, CheckCheck, Image, Film, FileText,
  Paperclip, Smile, Send
 } from 'lucide-react';
import ChatHeader from '../components/Chatpage/Chat/ChatHeader';
import Sidebar from '../components/Chatpage/SideBar/SideBar';
import EmptyState from '../components/Chatpage/EmptyState';
import ChatView from '../components/Chatpage/Chat/ChatView';
import NewGroup from '../components/Chatpage/Group/NewGroup';
import SearchBar from '../components/Chatpage/UI/SearchBar';
import Avatar from '../components/Chatpage/UI/Avatar';



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
      { id: 3, sender: 'Sarah Chen', text: 'Agreed! The linear is perfect', time: '10:33', read: true, self: false },
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

  const handleMediaUpload = (type) => {
    if (!selectedChat) return;
    
    const mediaMsg = {
      id: Date.now(),
      sender: 'You',
      text: `[${type} uploaded]`,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
      read: false,
      self: true,
      media: type
    };

    setMessages(prev => ({
      ...prev,
      [selectedChat.id]: [...(prev[selectedChat.id] || []), mediaMsg]
    }));
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

// EmptyState Component


export default App;

// ============================================
// SIDEBAR COMPONENTS
// ============================================

// components/Sidebar/SidebarHeader.jsx


// components/UI/SearchBar.jsx


// components/Sidebar/UserItem.jsx



// ============================================
// CHAT COMPONENTS
// ============================================

// components/Chat/ChatView.jsx

// components/Chat/ChatHeader.jsx


// components/Chat/MessageList.jsx
const MessageList = ({ messages, isGroup }) => (
  <div className="flex-1 overflow-y-auto p-4 space-y-4">
    {messages.map(msg => (
      <Message key={msg.id} message={msg} isGroup={isGroup} />
    ))}
  </div>
);


// components/Chat/MessageInput.jsx


// ============================================
// GROUP COMPONENTS
// ============================================



// components/Group/GroupForm.jsx

