import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import Like from "../assets/heart.svg";

import Comments from "./comments";

function Feed(props) {
  const [posts, setPosts] = useState([]);
  const [update, setUpdate] = useState(null)

  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    fetch("http://127.0.0.1:3000/api/feed", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((json) => {
        console.log(json);
        if (isMounted) {
          setPosts(json);
        }
      });
    return () => (isMounted = false);
  }, [update]);

  const handleLike = (id) => {
    const postId = { id: id };
    fetch("http://127.0.0.1:3000/api/like", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify(postId),
    }).then((res) => {
      if (res.ok && update) {
        setUpdate(0)
      } else if (res.ok && !update) {
        setUpdate(1)
      }
    });
  };

  return (
    <div className="posts">
      {posts.map((post) => {
        return (
          <div className="post-container" key={posts.indexOf(post)}>
            <div className="avatar">
              <img
                src={`http://127.0.0.1:3000/avatars/${post.user[0].avatar}`}
                alt="avatar"
              />
            </div>
            <div className="post">
              <Link to={`/${post.user[0].username}`}>
                {post.user[0].username}
              </Link>
              <div className="text">{post.text}</div>
              <div className="interactions">
                <div className="likes">
                  <div onClick={() => handleLike(post._id)}>
                    <Like fill={post.isLiked ? "red" : "none"} />
                  </div>
                  {post.likes.length > 0 ? post.likes.length : null}
                </div>
                <div
                  className="comments"
                  onClick={() => navigate(`/comment/${post._id}`)}
                >
                  {post.comments.length > 0 ? post.comments.length : null}
                </div>
              </div>
              <div className="timestamp">{post.createdAt.slice(0, 10)}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Feed;
