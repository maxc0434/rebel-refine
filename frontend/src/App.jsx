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
import FemaleDashboardPage from "./pages/FemaleDashboardPage";
import TranslatorDashboard from "./pages/TranslatorDashboard";
import PresentationPage from "./pages/PresentationPage";
import ViewMaleProfile from "./pages/ViewMaleProfile";
import CreditShop from "./pages/CreditShop";
import PaymentSuccess from "./pages/PaymentSuccess";

function App() {
  return (
    <Router>
      <Navbar/>
      <div style={{ height: '110px' }}></div>
        <Routes>

          <Route path="/" element={<PresentationPage />} />

          <Route path="/login" element={<LoginPage />} />

          <Route path="/register" element={<RegisterPage/>} />
          
          <Route path="/home" element={<HomePage/>} />
          
          <Route path="/members/females" element={<MembersPage/>} />
          
          <Route path="/profile/:id" element={<ProfilePage/>} />
          
          <Route path="/reset-password/:token" element={<ResetPasswordPage/>} />

          <Route path="/dashboard" element={<MemberDashboardPage />} />

          <Route path="/search" element={<SearchPage />} />

          <Route path="/female-dashboard" element={<FemaleDashboardPage />} />
          
          <Route path="/translator-dashboard" element={<TranslatorDashboard />} />

          <Route path="/view-male-profile/:id" element={<ViewMaleProfile />} />
          
          <Route path="/credit-shop" element={<CreditShop />} />

          <Route path="/payment/success" element={<PaymentSuccess />} />

        </Routes>
    </Router>
  );
}

export default App;
