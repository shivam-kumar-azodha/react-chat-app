import { useState } from "react";
import ChatList from "./ChatList";
import ChatBox from "../Chat/ChatBox";

const GlobalChat = ({ loggedInUser }: { loggedInUser: string }) => {
  const users = ["Alice", "Bob", "Charlie"];
  const [selectedUser, setSelectedUser] = useState("");

  const handleSelectUser = (user: string) => {
    setSelectedUser(user);
  };

  return (
    <div className="flex h-full">
      <ChatList
        users={users.filter((user) => user !== loggedInUser)}
        selectedUser={selectedUser}
        onSelectUser={handleSelectUser}
      />

      <ChatBox
        key={selectedUser}
        loggedInUser={loggedInUser}
        receiverId={selectedUser}
      />
    </div>
  );
};

export default GlobalChat;
