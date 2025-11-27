import Message from "./Message";

const MessageList = ({ messages, isGroup }) => (
  <div className="flex-1 overflow-y-auto p-4 space-y-4">
    {messages.map(msg => (
      <Message key={msg.id} message={msg} isGroup={isGroup} />
    ))}
  </div>
);

export default MessageList