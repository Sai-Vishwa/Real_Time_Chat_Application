import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageList from "./MessageList";

const ChatView = ({ chat, messages, onBack, onSendMessage, onMediaUpload }) => (
  <>
    <ChatHeader chat={chat} onBack={onBack} />
    <MessageList messages={messages} isGroup={chat.isGroup} />
    <MessageInput onSendMessage={onSendMessage} onMediaUpload={onMediaUpload} />
  </>
);

export default ChatView