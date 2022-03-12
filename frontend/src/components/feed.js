import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import Comments from "./comments";

function Feed(props) {
  const [posts, setPosts] = useState([]);
  const [isFeed, setIsFeed] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://127.0.0.1:3000/api/feed", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((json) => {
        setPosts(json);
      });
  }, []);

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
