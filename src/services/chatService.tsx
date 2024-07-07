import { useEffect } from "react";
import { socket } from "./socket";
import { IMessageData } from "../types";

// Hook to subscribe to messages
export const useSubscribeToMessages = (
  userId: string,
  setMessages: React.Dispatch<React.SetStateAction<IMessageData[]>>
) => {
  useEffect(() => {
    socket.emit("joinRoom", userId);

    const handleNewMessage = (messageData: IMessageData) => {
      setMessages((prevMessages) => [...prevMessages, messageData]);
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
  }, [userId, setMessages]);
};

// Function to send a message
export const sendMessage = (messageData: IMessageData) => {
  console.log("sending", messageData);
  if (messageData) {
    socket.emit("chatMessage", messageData);
  }
};
