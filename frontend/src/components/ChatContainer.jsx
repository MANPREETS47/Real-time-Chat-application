import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef } from "react";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils.js";

const ChatContainer = () => {
    const {messages, getMessages, isMessagesLoading, selectedUser, subscribeToMessages, unsubscribeFromMessages} = useChatStore(); 
    const {authUser} = useAuthStore(); 
    const MessageEndRef = useRef(null);
    useEffect(()=>{
        getMessages(selectedUser._id);
        subscribeToMessages();
        return () => {
            unsubscribeFromMessages();
        }
    },[selectedUser._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);
    useEffect(() => {
        if(MessageEndRef.current && messages) {
            MessageEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    if(isMessagesLoading) return <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
    </div>;
  return (
    <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div key={message._id} className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`}
            ref={MessageEndRef}>
              <div className="chat-image avatar w-10 h-10">
                <div>
                  <img src={message.senderId === authUser._id ? authUser.profilePic || "/avatar.png" : selectedUser.profilePic || "/avatar.png"} alt="profile pic"></img>
                </div>
              </div>
              <div className="chat-header mb-1">
                <time className="text-xs opacity-50 ml-1">
                  {formatMessageTime(message.createdAt)}
                </time>
              </div>
              <div className="chat-bubble flex flex-col">
                {message.image && (
                  <img src={message.image} alt="Attachment" className="sm:max-w-[200px] rounded-md mb-2"/>
                )}
                <p className="whitespace-pre-wrap">{message.text}</p>
              </div>
            </div>

          ))}
        </div>
        <MessageInput />
    </div>
  )
}

export default ChatContainer