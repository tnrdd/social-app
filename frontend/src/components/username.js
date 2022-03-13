import React from "react";
import { Link } from "react-router-dom";

function Username(props) {
  const { message } = props;

  return (
    <div className="username">
      <Link to={`/${message.user.username}`}>{message.user.username}</Link>
    </div>
  );
}

export default Username;
