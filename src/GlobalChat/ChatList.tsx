import React from "react";

interface SidebarProps {
  users: string[];
  selectedUser: string;
  onSelectUser: (user: string) => void;
}

const ChatList: React.FC<SidebarProps> = ({
  users,
  selectedUser,
  onSelectUser,
}) => {
  return (
    <div className="h-full bg-gray-100 p-4">
      <h2 className="text-xl font-bold mb-4">Chats</h2>
      {users.map((user) => (
        <div
          key={user}
          className={`p-2 cursor-pointer ${
            user === selectedUser ? "bg-gray-300" : ""
          }`}
          onClick={() => {
            onSelectUser(user);
          }}
        >
          {user}
        </div>
      ))}
    </div>
  );
};

export default ChatList;
