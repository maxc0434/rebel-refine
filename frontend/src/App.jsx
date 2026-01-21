import React from "react";
import LoginPage from "./pages/LoginPage";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";


function App() {
  return (
    <Router>
      <Navbar/>
        <Routes>

          <Route path="/" element={<LoginPage />} />

        </Routes>
    </Router>
  );
}

export default App;
