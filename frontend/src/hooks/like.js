import React, { useState } from "react";

function useLike(props) {
  const [toggleLike, setToggleLike] = useState({ toggle: false, id: "" });

  const handleLike = (id) => {
    const targetId = { id: id };
    fetch(`${process.env.BASE_URL}/api/like`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify(targetId),
    }).then((res) => {
      if (res.ok) {
        setToggleLike({ toggle: !toggleLike.toggle, id: id });
      }
    });
  };

  return [toggleLike, handleLike];
}

export default useLike;
