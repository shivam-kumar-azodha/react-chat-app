import { useState } from "react";
import ChatList from "./ChatList";
import ChatBox from "../Chat/ChatBox";

const GlobalChat = ({ loggedInUser }: { loggedInUser: string }) => {
  const [users] = useState(["Bob", "Charlie"]);
  const [selectedUser, setSelectedUser] = useState("");

  const handleSelectUser = (user: string) => {
    setSelectedUser(user);
  };

  return (
    <div className="flex h-full">
      <ChatList
        users={users}
        selectedUser={selectedUser}
        onSelectUser={handleSelectUser}
      />

      <ChatBox loggedInUser={loggedInUser} receiverId={selectedUser} />
    </div>
  );
};

export default GlobalChat;
