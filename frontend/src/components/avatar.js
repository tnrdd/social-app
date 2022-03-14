import React from "react";

function Avatar(props) {
  const { message } = props;

  return (
    <div className="avatar">
      <img
        src={`http://127.0.0.1:3000/avatars/${message.user.avatar}`}
        alt="avatar"
      />
    </div>
  );
}

export default Avatar;
