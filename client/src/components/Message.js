import React from "react";

const Message = ({ user, message }) => {
  return (
    <div className="message">
      <strong>{user}:</strong> {message}
    </div>
  );
};

export default Message;