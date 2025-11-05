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
  const [currentUser, setCurrentUser] = useState(null);

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

  const [chats, setChats] = useState([aiBot]);
  const [messages, setMessages] = useState({
    'ai-bot': [
      { id: 1, sender: 'AI Assistant', text: 'Hello! I\'m your AI assistant. I can help you with questions, provide information, or just chat. How can I assist you today?', time: '09:00', read: true, self: false, isBot: true },
    ]
  });
  const [allUsers, setAllUsers] = useState([]);

  // Transform backend data to frontend format
  const transformBackendData = (backendData) => {
    const { currentUser, users, chats: backendChats, messages: backendMessages } = backendData;

    // Set current user
    setCurrentUser(currentUser);

    // Transform users list
    const transformedUsers = users
      .filter(user => user.id !== currentUser.id) // Exclude current user
      .map(user => ({
        id: user.id,
        name: user.displayName,
        avatar: user.avatar || '👤',
        online: true // You can add online status from backend if available
      }));

    // Transform chats
    const transformedChats = backendChats.map(chat => {
      // Find the last message for this chat
      const chatMessages = backendMessages.filter(msg => msg.chatId === chat.id);
      const lastMsg = chatMessages[chatMessages.length - 1];

      return {
        id: chat.id,
        name: chat.name,
        avatar: chat.isGroup ? '👥' : getUserAvatar(chat, users, currentUser.id),
        online: true,
        isGroup: chat.isGroup,
        members: chat.isGroup ? chat.members.length : undefined,
        lastMessage: lastMsg ? lastMsg.text : 'Start chatting',
        time: lastMsg ? lastMsg.time : 'now',
        unread: 0 // You can calculate unread from backend data if available
      };
    });

    // Transform messages - group by chatId
    const transformedMessages = {};
    backendChats.forEach(chat => {
      const chatMsgs = backendMessages
        .filter(msg => msg.chatId === chat.id)
        .map(msg => ({
          id: msg.id,
          sender: msg.senderId === currentUser.id ? 'You' : getUserName(msg.senderId, users),
          text: msg.text,
          time: msg.time,
          read: true, // You can add read status from backend if available
          self: msg.senderId === currentUser.id,
          media: msg.mediaType !== 'none' ? msg.mediaType : undefined,
          fileName: msg.fileName,
          imageUrl: msg.blobUrl,
          fileSize: msg.fileName ? 'File' : undefined // You can calculate actual size if available
        }));
      
      transformedMessages[chat.id] = chatMsgs;
    });

    return { transformedUsers, transformedChats, transformedMessages };
  };

  // Helper to get user avatar for 1-on-1 chats
  const getUserAvatar = (chat, users, currentUserId) => {
    if (chat.isGroup) return '👥';
    
    // For 1-on-1 chat, find the other user
    // Assuming chat name format is "User1 & User2"
    const otherUser = users.find(u => u.id !== currentUserId && chat.name.includes(u.displayName));
    return otherUser?.avatar || '👤';
  };

  // Helper to get user display name
  const getUserName = (userId, users) => {
    const user = users.find(u => u.id === userId);
    return user?.displayName || 'Unknown';
  };

  const handleSendMessage = async (messageData) => {
    if (!selectedChat || !currentUser) return;

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

    // Optimistically update UI
    setMessages(prev => ({
      ...prev,
      [selectedChat.id]: [...(prev[selectedChat.id] || []), newMsg]
    }));

    // Update last message in chat list
    setChats(prev => prev.map(chat => 
      chat.id === selectedChat.id 
        ? { ...chat, lastMessage: newMsg.text, time: newMsg.time }
        : chat
    ));

    try {
      const session = Cookies.get('session');
      
      // Prepare backend payload
     const formData = new FormData();
      formData.append("session", session);
      formData.append("chatId", selectedChat.id);
      formData.append("senderId", currentUser.id);
      formData.append("text", newMsg.text);
      formData.append("mediaType", newMsg.media || "none");
      formData.append("fileName", newMsg.fileName || "");
      formData.append("time", newMsg.time);

      if (newMsg.file) {
        formData.append("file", newMsg.file); // file = actual File object from <input>
      }




      // If there's a file, you'll need to upload it to blob storage first
      // and get the blobUrl, then send that with the message
      if (messageData.file) {
        // TODO: Implement file upload to Azure Blob Storage
        // const blobUrl = await uploadToBlob(messageData.file.file);
        // payload.blobUrl = blobUrl;
        // payload.blobName = generateBlobName(messageData.file.file.name);
      }

      const response = await fetch("http://localhost:5000/send-messages", {
        method: "POST",
        body: formData
      });

      const result = await response.json();

      if (result.status === "success") {
        console.log("✅ Message saved to database:", result.data);
        
        // Update message with server-assigned ID if needed
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
        // TODO: Show error notification and maybe mark message as failed
      }
    } catch (error) {
      console.error("❌ Error sending message to backend:", error);
      // TODO: Show error notification
    }

    // AI bot response (only for AI bot chats)
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

  const handleMediaUpload = async (type, file) => {
    console.log('Media upload triggered:', type, file);
    // The new MessageInput component handles this through onSendMessage
  };

  const handleCreateGroup = async (groupName, selectedMembers) => {
    if (!groupName.trim() || selectedMembers.length === 0 || !currentUser) return;

    try {
      const session = Cookies.get('session');
      
      const response = await fetch("http://localhost:5000/create-group", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session: session,
          groupName: groupName,
          members: [currentUser.id, ...selectedMembers] // Include current user
        })
      });

      const result = await response.json();

      if (result.status === "success") {
        const newGroup = {
          id: result.data.groupId,
          name: groupName,
          avatar: '👥',
          online: true,
          isGroup: true,
          members: selectedMembers.length + 1, // +1 for current user
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
        console.log("✅ Group created successfully");
      } else {
        console.error("❌ Failed to create group:", result.message);
      }
    } catch (error) {
      console.error("❌ Error creating group:", error);
    }
  };

  const handleUserChat = (user) => {
    const existingChat = chats.find(c => 
      !c.isGroup && !c.isBot && c.name.includes(user.name)
    );
    
    if (existingChat) {
      setSelectedChat(existingChat);
      setView('chat');
    } else {
      // Create new chat
      const newChat = {
        id: `temp-${Date.now()}`, // Temporary ID
        name: `${currentUser?.displayName} & ${user.name}`,
        avatar: user.avatar,
        online: user.online,
        lastMessage: 'Start chatting',
        time: 'now',
        unread: 0
      };
      setChats(prev => [newChat, ...prev]);
      setMessages(prev => ({ ...prev, [newChat.id]: [] }));
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
    const session = Cookies.get('session');

    const loadChatData = async () => {
      try {
        const res = await fetch("http://localhost:5000/chat-page", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ session: session })
        });

        const resp = await res.json();

        if (resp.status === "error") {
          console.error("Error fetching chat data:", resp.message);
          return;
        }

        console.log("Backend data:", resp.data);

        const { transformedUsers, transformedChats, transformedMessages } = 
          transformBackendData(resp.data);

        // Set all users (excluding current user, already filtered in transform)
        setAllUsers(transformedUsers);

        // Set chats (AI bot + transformed chats)
        setChats([aiBot, ...transformedChats]);

        // Set messages (AI bot messages + transformed messages)
        setMessages({
          'ai-bot': messages['ai-bot'], // Keep AI bot messages
          ...transformedMessages
        });

        console.log("✅ Chat data loaded and transformed successfully");
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