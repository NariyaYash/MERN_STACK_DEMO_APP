import { React, useEffect, useState } from "react";
import style from "../css/profilePage.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ProfilePage() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({});
  const [USERNAME, setUSERNAME] = useState("");
  const [buttonHendler, setButtonHendler] = useState(true);

  const [password, setPassword] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    axios
      .get("http://localhost:5000", { withCredentials: true })
      .then((res) => {
        if (res.data.valid) {
          setUSERNAME(res.data.user.firstName);
          setUserData(res.data.user);
          return;
        } else {
          return navigate("/");
        }
      })
      .catch((error) => console.log(error));
  }, [navigate]);

  const logOutHendler = () => {
    axios
      .get("http://localhost:5000/user/logout", { withCredentials: true })
      .then((res) => {
        alert("Log-out Successfully");
        return navigate("/");
      })
      .catch((error) => {
        alert(error);
      });
  };

  const inputHendler = (e) => {
    const { value, name } = e.target;
    setUserData({ ...userData, [name]: value });
    setButtonHendler(false);
  };

  const updateHendler = (e) => {
    e.preventDefault();

    const payload = {
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      userName: userData.userName,
    };

    axios
      .patch("http://localhost:5000/user/update", payload, {
        withCredentials: true,
      })
      .then((res) => {
        setUSERNAME(userData.firstName);
        alert("Update Successfully 🎆");
        return;
      })
      .catch((error) => {
        if (error.response.status === 400) {
          return alert("Update Error");
        } else if (error.response.status === 445) {
          return alert("Email id allredy Exists!!! ");
        } else {
          return alert("Error", error);
        }
      });
  };

  const inputPasswordHendler = (e) => {
    const { name, value } = e.target;
    setPassword({ ...password, [name]: value });
  };

  const passwordHendler = (e) => {
    e.preventDefault();
    if (password.confirmPassword !== password.newPassword) {
      return alert("Confirm password and new password are not match!");
    }
    if (
      password.currentPassword.length < 10 &&
      password.confirmPassword < 10 &&
      password.newPassword < 10
    ) {
      return alert("password length min 10");
    }

    const payload = {
      newPassword: password.newPassword,
      currentPassword: password.currentPassword,
    };
    axios
      .patch("http://localhost:5000/user/passwordUpdate", payload, {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data.isPasswordCorrect) {
          return alert("passWord Successfully Updated ✔✔");
        } else {
          return alert("📍Current-PassWord is Wrong📍");
        }
      })
      .catch((error) => console.log(error));
  };

  return (
    <div className={style.cardCoustom}>
      <div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={logOutHendler}
        >
          LogOut
        </button>
      </div>
      <div className={style.heading}>PROFILE PAGE</div>
      <div className="container">
        <div className={style.mainBody}>
          <form onSubmit={updateHendler}>
            <div className="row gutters-sm">
              <div className={`${style.imgRow} `}>
                <div className={style.card}>
                  <div className={style.cardBody}>
                    <div className="d-flex flex-column align-items-center text-center">
                      <img
                        src="https://bootdey.com/img/Content/avatar/avatar7.png"
                        alt="Admin"
                        className="rounded-circle"
                        width={150}
                      />
                      <div className="mt-3">
                        <h3>{USERNAME}</h3>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-2">
                <div className={style.card}>
                  <div className={style.cardBody}>
                    <div className="row">
                      <div className="col-sm-12">
                        <h6 className="mb-0">First Name</h6>
                      </div>
                      <div className="col-sm-12 text-secondary">
                        <input
                          type="text"
                          name="firstName"
                          defaultValue={userData.firstName}
                          onChange={inputHendler}
                          required
                        />
                      </div>
                    </div>
                    <hr />
                    <div className="row">
                      <div className="col-sm-12">
                        <h6 className="mb-0">Last Name</h6>
                      </div>
                      <div className="col-sm-12 text-secondary">
                        <input
                          type="text"
                          name="lastName"
                          defaultValue={userData.lastName}
                          onChange={inputHendler}
                          required
                        />
                      </div>
                    </div>
                    <hr />
                    <div className="row">
                      <div className="col-sm-12">
                        <h6 className="mb-0">Email</h6>
                      </div>
                      <div className="col-sm-12 text-secondary">
                        <input
                          type="email"
                          name="email"
                          defaultValue={userData.email}
                          onChange={inputHendler}
                          required
                        />
                      </div>
                    </div>
                    <hr />
                    <div className="row">
                      <div className="col-sm-12">
                        <h6 className="mb-0">UserName</h6>
                      </div>
                      <div className="col-sm-12 text-secondary">
                        <input
                          type="text"
                          name="userName"
                          defaultValue={userData.userName}
                          onChange={inputHendler}
                          required
                        />
                      </div>
                    </div>
                    <hr />
                    <div className="row">
                      <div className="col-sm-12">
                        <button
                          className="btn btn-info "
                          target="__blank"
                          disabled={buttonHendler}
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
          <form onSubmit={passwordHendler}>
            <div className="row gutters-sm">
              <div className="mt-2">
                <div className={style.card}>
                  <div className={style.cardBody}>
                    <div className="row">
                      <div className="col-sm-12">
                        <h6 className="mb-0">Current Password: </h6>
                      </div>
                      <div className="col-sm-12">
                        <input
                          type="password"
                          name="currentPassword"
                          value={password.currentPassword}
                          onChange={inputPasswordHendler}
                          required
                        />
                      </div>
                    </div>
                    <hr />
                    <div className="row">
                      <div className="col-sm-12">
                        <h6 className="mb-0">New Password:</h6>
                      </div>
                      <div className="col-sm-12 text-secondary">
                        <input
                          type="password"
                          name="newPassword"
                          value={password.newPassword}
                          onChange={inputPasswordHendler}
                          required
                        />
                      </div>
                    </div>
                    <hr />
                    <div className="row">
                      <div className="col-sm-12">
                        <h6 className="mb-0">Confirm Password:</h6>
                      </div>
                      <div className="col-sm-12 text-secondary">
                        <input
                          type="password"
                          name="confirmPassword"
                          value={password.confirmPassword}
                          onChange={inputPasswordHendler}
                          required
                        />
                      </div>
                    </div>
                    <hr />
                    <div className="row">
                      <div className="col-sm-12">
                        <button className="btn btn-info " target="__blank">
                          save New passWord
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
