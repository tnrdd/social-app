import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Comments from "./comments";

function Posts(props) {
  const [posts, setPosts] = useState([]);
  const [commentsToggle, setCommentsToggle] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    fetch("http://127.0.0.1:3000/api/post", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((json) => {
        if (isMounted) {
          setPosts(json);
        }
      });
    return () => (isMounted = false);
  }, []);

  return (
    <div className="posts">
      {posts.map((post) => {
        return (
          <div className="post-container" key={posts.indexOf(post)}>
            <div className="avatar">
              <img
                src={`http://127.0.0.1:3000/avatars/${post.user.avatar}`}
                alt="avatar"
              />
            </div>
            <div className="post">
              <div className="username">{post.user.username}</div>
              <div className="text">{post.text}</div>
              <div className="interactions">
                <div className="likes">
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

export default Posts;
