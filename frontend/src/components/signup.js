import React, { useState, useEfect } from "react";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [errors, setErrors] = useState([]);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmation: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("http://127.0.0.1:3000/api/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify(formData),
    }).then((res) => {
      if (res.ok) {
        navigate("/login");
      } else {
        Promise.resolve(res.json()).then((result) => {
          setErrors(result.errors);
        });
      }
    });
  };

  return (
    <div id="signup">
      <h4>Signup</h4>
      <form id="signup-form" onSubmit={handleSubmit}>
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
        <input
          type="password"
          name="confirmation"
          placeholder="Password confirmation"
          value={formData.confirmation}
          onChange={handleChange}
        />
        <button>Sign Up</button>
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

export default Signup;
