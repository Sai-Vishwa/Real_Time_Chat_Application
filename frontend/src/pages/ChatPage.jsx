import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Chatpage/SideBar/SideBar';
import EmptyState from '../components/Chatpage/EmptyState';
import ChatView from '../components/Chatpage/Chat/ChatView';
import NewGroup from '../components/Chatpage/Group/NewGroup';
import { Users } from 'lucide-react';
import Cookies from 'js-cookie';


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

  const [allUsers, setAllUsers] = useState([
    { id: 6, name: 'Emma Wilson', avatar: '👩‍🎨', online: true },
    { id: 7, name: 'James Lee', avatar: '👨‍💻', online: false },
    { id: 8, name: 'Olivia Brown', avatar: '👩‍🔬', online: true },
    { id: 9, name: 'Noah Davis', avatar: '👨‍🎤', online: true },
    { id: 10, name: 'Sophia Martinez', avatar: '👩‍🏫', online: false },
  ]);

  // FIXED: Handle both old string format and new object format
  const handleSendMessage = async (messageData) => {
    if (!selectedChat) return;

    let newMsg;

    // Check if it's the old format (just a string) or new format (object)
    if (typeof messageData === 'string') {
      // Old format - just text
      newMsg = {
        id: Date.now(),
        sender: 'You',
        text: messageData,
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
        read: false,
        self: true
      };
    } else {
      // New format - object with text and/or file
      if (messageData.file) {
        // Message with file
        newMsg = {
          id: Date.now(),
          sender: 'You',
          text: messageData.text || messageData.file.file.name,
          time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
          read: false,
          self: true,
          media: messageData.file.type,
          fileName: messageData.file.file.name,
          fileSize: `${(messageData.file.file.size / 1024).toFixed(1)} KB`,
          imageUrl: messageData.filePreview
        };
      } else if (messageData.text && messageData.text.trim()) {
        // Text only message
        newMsg = {
          id: Date.now(),
          sender: 'You',
          text: messageData.text,
          time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
          read: false,
          self: true
        };
      } else {
        return; // Nothing to send
      }
    }

    setMessages(prev => ({
      ...prev,
      [selectedChat.id]: [...(prev[selectedChat.id] || []), newMsg]
    }));

    try {
      console.log("HHHHHHHHHHHHHHHHHHh  ")
    const response = await fetch("http://localhost:5000/send-messages", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        // Add authorization header if needed
        // "Authorization": `Bearer ${yourAuthToken}`
      },
      body: JSON.stringify({
        chatId: selectedChat.id,
        senderId: 'your-user-id', // Replace with actual user ID from auth
        message: {
          text: newMsg.text,
          media: newMsg.media || null,
          fileName: newMsg.fileName || null,
          fileSize: newMsg.fileSize || null,
          imageUrl: newMsg.imageUrl || null,
          time: newMsg.time
        }
      })
    });

    const result = await response.json();

    if (result.status === "success") {
      console.log("✅ Message saved to database:", result.data);
      
      // Optional: Update message with server-assigned ID
      if (result.data.messageId) {
        setMessages(prev => ({
          ...prev,
          [selectedChat.id]: prev[selectedChat.id].map(msg => 
            msg.id === newMsg.id ? { ...msg, id: result.data.messageId } : msg
          )
        }));
      }
    } else {
      console.error("❌ Failed to save message:", result.message);
      // Optional: Show error notification to user
      // You might want to mark the message as "failed" in the UI
    }
  } catch (error) {
    console.error("❌ Error sending message to backend:", error);
    // Optional: Show error notification and allow retry
  }

    // AI bot response
    if (selectedChat.isBot) {
      setTimeout(() => {
        const aiResponse = {
          id: Date.now() + 1,
          sender: 'AI Assistant',
          text: `I received your message${newMsg.media ? ` with a ${newMsg.media}` : ''}: "${newMsg.text}". As a demo AI, I'm here to assist you with any questions!`,
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

  // This can now be optional since MessageInput handles everything
  const handleMediaUpload = async (type, file) => {
    console.log('Media upload triggered:', type, file);
    // The new MessageInput component handles this through onSendMessage
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



  useEffect(() => {

    const session = Cookies.get('session')

    const loadChatData = async () => {
      try {
        const res = await fetch("http://localhost:5000/chat-page", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            session : session
          })
        });

        const resp = await res.json();

        console.log(JSON.stringify(resp.data))

        if (resp.status === "error") {
          console.error("Error fetching chat data:", resp.message);
          return;
        }

        const { aiBot, chats, messages, allUsers } = resp.data;

        setChats([aiBot, ...chats.map((chat) => ({
          id: chat.id,
          name: chat.name,
          avatar: chat.avatar || '💬',
          online: true,
          isGroup: chat.isGroup,
          members: chat.members || 0,
          lastMessage: chat.lastMessage || '',
          time: chat.time || '',
          unread: chat.unread || 0
        }))]);

        const formattedMessages = {};
        Object.entries(messages).forEach(([chatId, msgs]) => {
          formattedMessages[chatId] = msgs.map((msg) => ({
            id: msg.id,
            sender: msg.sender,
            text: msg.text,
            time: msg.time,
            read: true,
            self: msg.self,
            isBot: msg.isBot,
            media: msg.media,
            fileName: msg.fileName,
            imageUrl: msg.imageUrl,
            fileSize: msg.fileSize
          }));
        });
        setMessages(formattedMessages);

        setAllUsers(allUsers.map((user) => ({
          id: user.id,
          name: user.name,
          avatar: user.avatar || '🙂',
          online: user.online
        })));

        console.log("✅ Chat data loaded successfully");
      } catch (error) {
        console.error("❌ Error fetching chat data:", error);
      }
    };

    loadChatData();
  }, []);

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

export default App;