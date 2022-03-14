import React from "react";
import {useNavigate} from "react-router-dom";
import {IoMdArrowRoundBack} from "react-icons/io"

function Back() {
  const navigate = useNavigate();

  return (
    <div className="back">
      <IoMdArrowRoundBack className="back-icon" size={25} onClick={() => navigate(-1)}/>
    </div>
  );
}

export default Back;
