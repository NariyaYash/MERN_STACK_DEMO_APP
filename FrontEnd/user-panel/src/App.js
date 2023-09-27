import LogIn from "./component/LogIn";
import "./App.css";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import SignUp from "./component/SignUp";
import ProfilePage from "./component/ProfilePage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LogIn />} />
        <Route path="/sign_up" element={<SignUp />} />
        <Route path="/userProfile" element={<ProfilePage />} />
      </Routes>
    </Router>
  );
}

export default App;
