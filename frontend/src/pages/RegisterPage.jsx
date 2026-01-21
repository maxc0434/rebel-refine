import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function RegisterPage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Données d'inscription :", formData);
  };

  return (
    <>
      {/* ==========Page Header Section Start Here========== */}
      <section className="page-header-section style-1 bgimg" style={{ backgroundImage: 'url(/assets/images/bg-img/pageheader.jpg)' }}>
        <div className="container">
          <div className="page-header-content">
            <div className="page-header-inner">
              <div className="page-title">
                <h2>Registration Page</h2>
              </div>
              <ol className="breadcrumb">
                <li><Link to="/">Home</Link></li>
                <li className="active">Sign up</li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* ==========Sign up Section start Here========== */}
      <div className="login-section padding-tb">
        <div className="container">
          <div className="account-wrapper">
            <h3 className="title">Register Now</h3>
            <form className="account-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <input 
                  type="text" 
                  placeholder="User Name" 
                  name="username" 
                  value={formData.username}
                  onChange={handleChange}
                  required 
                />
              </div>
              <div className="form-group">
                <input 
                  type="email" 
                  placeholder="Email" 
                  name="email" 
                  value={formData.email}
                  onChange={handleChange}
                  required 
                />
              </div>
              <div className="form-group">
                <input 
                  type="password" 
                  placeholder="Password" 
                  name="password" 
                  value={formData.password}
                  onChange={handleChange}
                  required 
                />
              </div>
              <div className="form-group">
                <input 
                  type="password" 
                  placeholder="Confirm Password" 
                  name="confirmPassword" 
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required 
                />
              </div>
              <div className="form-group">
                <button type="submit" className="d-block lab-btn">
                  <span>Get Started Now</span>
                </button>
              </div>
            </form>
            
            <div className="account-bottom">
              <span className="d-block cate pt-10">
                Are you a member? <Link to="/">Login</Link>
              </span>
              <span className="or"><span>or</span></span>
              <h5 className="subtitle">Register With Social Media</h5>
              <ul className="social-media social-color justify-content-center d-flex lab-ul">
                <li><a href="#" className="facebook"><i className="icofont-facebook"></i></a></li>
                <li><a href="#" className="twitter"><i className="icofont-twitter"></i></a></li>
                <li><a href="#" className="linkedin"><i className="icofont-linkedin"></i></a></li>
                <li><a href="#" className="instagram"><i className="icofont-instagram"></i></a></li>
                <li><a href="#" className="pinterest"><i className="icofont-pinterest"></i></a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default RegisterPage;