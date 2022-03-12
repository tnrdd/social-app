import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";

import useFeed from "../hooks/feed";

import Like from "../assets/heart.svg";

function Comments(props) {
  const navigate = useNavigate();
  const { postid } = useParams();
  /*  const [posts, setComments] = useState([]);

  useEffect(() => {
    fetch(
      `http://127.0.0.1:3000/api/${
        props.isFeed ? "feed/post" : "post"
      }?id=${postid}`,
      {
        credentials: "include",
      }
    )
      .then((res) => res.json())
      .then((json) => {
        setComments(json);
        console.log(json);
      });
  }, []);
  */

  const url = `${props.isLoggedIn ? "feed/comment" : "comment"}?id=${postid}`;
  const [{ messages, toggleLike }, handleLike] = useFeed(url);

  return (
    <div className="comments">
      <div className="back">
        <p onClick={() => navigate(-1)}>Back</p>
      </div>
      {messages.map((message) => {
        return (
          <div className="comment-container" key={messages.indexOf(message)}>
            <div className="avatar">
              <img
                src={`http://127.0.0.1:3000/avatars/${message.user.avatar}`}
                alt="avatar"
              />
              <div className="timestamp">{message.createdAt.slice(0, 10)}</div>
            </div>
            <div className="comment">
              <div className="username">
              <Link to={`/${message.user.username}`}>
                {message.user.username}
              </Link>
              </div>
              <div className="text">{message.text}</div>
              <div className="interactions">
                <div className="likes">
                  <div onClick={() => handleLike(message._id)}>
                    <Like fill={message.isLiked ? "red" : "none"} />
                  </div>
                  {message.likes.length > 0 ? message.likes.length : null}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Comments;
