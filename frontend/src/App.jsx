import LoginPage from "./pages/LoginPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import MembersPage from "./pages/MembersPage";
import ProfilePage from "./pages/ProfilePage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import MemberDashboardPage from "./pages/MemberDashboardPage";
import SearchPage from "./pages/SearchPage";

function App() {
  return (
    <Router>
      <Navbar/>
      <div style={{ height: '110px' }}></div>
        <Routes>

          <Route path="/" element={<LoginPage />} />

          <Route path="/register" element={<RegisterPage/>} />
          
          <Route path="/home" element={<HomePage/>} />
          
          <Route path="/members/females" element={<MembersPage/>} />
          
          <Route path="/profile/:id" element={<ProfilePage/>} />
          
          <Route path="/reset-password/:token" element={<ResetPasswordPage/>} />

          <Route path="/dashboard" element={<MemberDashboardPage />} />

          <Route path="/search" element={<SearchPage />} />

        </Routes>
    </Router>
  );
}

export default App;
