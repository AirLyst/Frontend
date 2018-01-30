import React from "react";
import "./styles/ChatBottom.scss";

const ChatBoxItem = ({
  id,
  num,
  populateChat,
  firstName,
  conversation,
  preview
}) => (
  <div
    className={num % 2 ? "chatBottom-list-item" : "chatBottom-list-item--alt"}
    onClick={() => {
      populateChat(id, num);
    }}
  >
    {firstName} - {conversation} - {preview.body}
  </div>
);

export default ChatBoxItem;
