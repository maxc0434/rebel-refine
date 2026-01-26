import React from "react";
import LoginPage from "./pages/LoginPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";


function App() {
  return (
    <Router>
      <Navbar/>
      <div style={{ height: '100px' }}></div>
        <Routes>

          <Route path="/" element={<LoginPage />} />

          <Route path="/register" element={<RegisterPage/>} />
          
          <Route path="/home" element={<HomePage/>} />

        </Routes>
    </Router>
  );
}

export default App;
