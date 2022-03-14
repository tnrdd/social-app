import React from "react";
import {useNavigate} from "react-router-dom";

function Back() {
  const navigate = useNavigate();

  return (
    <div className="back">
      <p onClick={() => navigate(-1)}>Back</p>
    </div>
  );
}

export default Back;
