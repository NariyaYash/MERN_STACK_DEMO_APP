import { React, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";

function Login() {
  const navigate = useNavigate();
  const [cookies, setCookie] = useCookies(["myCookie"]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5000", { withCredentials: true })
      .then((res) => {
        if (res.data.valid) {
          return navigate("/userProfile");
        } else {
          return;
        }
      })  
      .catch((error) => console.log(error));
  }, [navigate]);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const loginHendler = (e) => {
    e.preventDefault();
    if (password.length < 10) {
      alert("password length min 10");
      return;
    }

    const payload = {
      email: email,
      password: password,
    };

    axios
      .post("http://localhost:5000/user/login", payload)
      .then((res) => {
        console.log("LOG_IN SUCCESSFULLY");
        setCookie("access_token", res.data.token, { path: "/" });
        navigate("/userProfile", { replace: true });
      })
      .catch((error) => {
        if (error.response.status === 400) {
          return alert("Login unable");
        }
        alert(error);
      });
  };
  return (
    <>
      <div className="container">
        <div className="form-container">
          <form id="login-form" onSubmit={loginHendler}>
            <div className="heading-btn-center">
              <h2>Login</h2>
            </div>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="signup-email"
              name="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="email"
              required
            />

            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="signup-password"
              value={password}
              onChange={handlePasswordChange}
              placeholder="Password"
              name="password"
              required
            />
            <div>
              <Link to={"/sign_up"}>New User ?</Link>
            </div>
            <div className="heading-btn-center">
              <button type="submit">log in</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;
