import React, { useState } from "react";

function useLike(props) {
  const [toggleLike, setToggleLike] = useState(0);

  const handleLike = (id) => {
    const targetId = { id: id };
    fetch("http://127.0.0.1:3000/api/like", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify(targetId),
    }).then((res) => {
      if (res.ok) {
        setToggleLike(!toggleLike);
      }
    });
  };

  return [toggleLike, handleLike];
}

export default useLike;
