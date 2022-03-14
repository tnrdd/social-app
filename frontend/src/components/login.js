import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Login(props) {
  const [errors, setErrors] = useState([]);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("http://127.0.0.1:3000/api/login", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify(formData),
    }).then((res) => {
      if (res.ok) {
        props.setIsLoggedIn(true);
        navigate("/");
      } else {
        Promise.resolve(res.json()).then((result) => {
          if (result) {
            setErrors(result.errors);
          }
        });
      }
    });
  };

  return (
    <div id="login">
      <h4>Log in</h4>
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
