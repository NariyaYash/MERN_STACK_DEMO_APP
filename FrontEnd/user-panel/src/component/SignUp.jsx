import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import { useState } from "react";

function SignUp() {
  const navigate = useNavigate();
  const [cookies, setCookie] = useCookies(["myCookie"]);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    userName: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const createUserHendlare = async (e) => {
    e.preventDefault();
    
    if (formData.password.length < 10) {
      alert("password length min 10");
      return;
    }

    const payload = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
      userName: formData.userName,
    };

    axios
      .post("http://localhost:5000/addUser", payload)
      .then((res) => {
        setCookie("access_token", res.data.token, { path: "/" });
        return navigate("/userProfile", { replace: true });
      })
      .catch((error) => {
        alert(error);
      });
  };

  return (
    <div className="container">
      <div className="form-container">
        <form id="signup-form" onSubmit={createUserHendlare}>
          <div className="heading-btn-center">
            <h2>Sign Up</h2>
          </div>
          <label htmlFor="firstName">First Name:</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            placeholder="firstName"
            required
          />

          <label htmlFor="lastName">Last Name:</label>
          <input
            type="text"
            id="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            name="lastName"
            placeholder="lastName"
            required
          />

          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={handleInputChange}
            name="email"
            placeholder="email"
            required
          />

          <label htmlFor="userName">Username:</label>
          <input
            type="text"
            id="signup-username"
            value={formData.userName}
            onChange={handleInputChange}
            name="userName"
            placeholder="Username"
            required
          />

          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="signup-password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Password"
            name="password"
            required
          />
          <div>
            <Link to={"/"}>Already Signup?</Link>
          </div>
          <div className="heading-btn-center">
            <button type="submit">Sign Up</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
