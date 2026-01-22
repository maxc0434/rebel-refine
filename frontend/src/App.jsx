import React from "react";
import LoginPage from "./pages/LoginPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import RegisterPage from "./pages/RegisterPage";


function App() {
  return (
    <Router>
      <Navbar/>
        <Routes>

          <Route path="/" element={<LoginPage />} />

          <Route path="/register" element={<RegisterPage/>} />

        </Routes>
    </Router>
  );
}

export default App;
