import { useEffect } from "react";
import { socket } from "./socket";

export interface IMessageData {
  senderId: string;
  receiverId: string;
  message: string;
}

// Function to subscribe to chat messages
export const useSubscribeToMessages = (setMessages: any) => {
  useEffect(() => {
    const handleNewMessage = (messageData: IMessageData) => {
      setMessages((prevMessages: any) => [...prevMessages, messageData]);
    };

    const handlePreviousMessages = (msgs: IMessageData[]) => {
      setMessages(msgs);
    };

    socket.on("chatMessage", handleNewMessage);
    socket.on("previousMessages", handlePreviousMessages);

    // Cleanup on unmount
    return () => {
      socket.off("chatMessage", handleNewMessage);
      socket.off("previousMessages", handlePreviousMessages);
    };
  }, [setMessages]);
};

// Function to send a message
export const sendMessage = (messageData: IMessageData) => {
  if (messageData) {
    socket.emit("chatMessage", messageData);
  }
};
