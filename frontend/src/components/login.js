import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useForm from "../hooks/form"

function Login(props) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const resource = "login";
  const redirect =  "/";
  const {setIsLoggedIn} = props;
  const [errors, handleChange, handleSubmit] = useForm({setIsLoggedIn, formData, setFormData, resource, redirect})

  return (
    <div id="login">
      <h1>Log in</h1>
      <form id="login-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
        />
        <button>Log in</button>
      </form>
      {errors.length > 0 ? (
        <div id="validation-errors">
          {errors.map((error) => {
            return <p key={errors.indexOf(error)}>{error.msg}</p>;
          })}
        </div>
      ) : null}
    </div>
  );
}

export default Login;
