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
    <div className="w-1/4 h-full bg-gray-100 p-4">
      <h2 className="text-xl font-bold mb-4">Chats</h2>
      {users.map((user) => (
        <div
          key={user}
          className={`p-2 cursor-pointer ${
            user === selectedUser ? "bg-gray-300" : ""
          }`}
          onClick={() => {
            console.log("User selected: ", user); // Doesn't logs on click
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