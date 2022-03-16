import React from "react";

function Avatar(props) {
  const { avatar } = props;

  return (
    <div className="avatar">
      <img src={`${process.env.BASE_URL}/avatars/${avatar || "default.jpeg"}`} alt="avatar" />
    </div>
  );
}

export default Avatar;
