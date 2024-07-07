import { useEffect } from "react";
import { socket } from "./socket";

export interface IMessageData {
  senderId: string;
  receiverId: string;
  message: string;
}

// Function to subscribe to chat messages
export const subscribeToMessages = (setMessages: any) => {
  useEffect(() => {
    const handleNewMessage = (messageData: IMessageData) => {
      setMessages((prevMessages: any) => [...prevMessages, messageData]);
    };

    socket.on("chatMessage", handleNewMessage);

    // Cleanup on unmount
    return () => {
      socket.off("chatMessage", handleNewMessage);
    };
  }, [setMessages]);
};

// Function to send a message
export const sendMessage = (messageData: IMessageData) => {
  if (messageData) {
    socket.emit("chatMessage", messageData);
  }
};
