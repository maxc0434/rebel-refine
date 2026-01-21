import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <header className="header-section">
      <div className="header-bottom">
        <div className="container">
          <div className="header-wrapper">
            <div className="logo">
              <Link to="/">
                <img src="/assets/images/logo/rebel_refine_logo_resized.png" alt="logo" style={{ height: '80px', width: 'auto' }} />
              </Link>
            </div>
            <div className="menu-area">
              <ul className="menu">
                <li>
                  <Link to="/">Home</Link>
                  <ul className="submenu">
                    <li><Link to="/">Home Page One</Link></li>
                  </ul>
                </li>
                <li>
                   <Link to="#0">Features</Link>
                   <ul className="submenu">
                      <li><Link to="/members">All Members</Link></li>
                   </ul>
                </li>
                <li><Link to="/contact">Contact</Link></li>
              </ul>
              
              <Link to="/" className="login"><i className="icofont-user"></i> <span>LOG IN</span></Link>
              <Link to="/register" className="signup"><i className="icofont-users"></i> <span>SIGN UP</span></Link>

              <div className="header-bar d-lg-none">
                <span></span><span></span><span></span>
              </div>
              <div className="ellepsis-bar d-lg-none">
                <i className="icofont-info-square"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;