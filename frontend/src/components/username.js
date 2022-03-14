import React from "react";
import { Link } from "react-router-dom";

function Username(props) {
  const { username } = props;

  return (
    <div className="username">
      <Link to={`/${username}`}>{username}</Link>
    </div>
  );
}

export default Username;
