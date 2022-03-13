import React from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import useFeed from "../hooks/feed";
import Messages from "./messages";

function Comments(props) {
  const navigate = useNavigate();
  const { postid } = useParams();
  const url = `comment?id=${postid}`;
  const [ messages, toggleLike, handleLike] = useFeed({isLoggedIn, url});
  const { isLoggedIn } = props;

  return (
    <div className="messages">
      <div className="back">
        <p onClick={() => navigate(-1)}>Back</p>
      </div>
      <Messages
        isLoggedIn={isLoggedIn}
        toggleLike={toggleLike}
        handleLike={handleLike}
        messages={messages}
      />
    </div>
  );
}

export default Comments;
