import React, { useState } from 'react';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Connexion...", { email, password });
  };

  return (
    <div className="login-section d-flex align-items-center justify-content-center" 
         style={{ 
           minHeight: '100vh',
           // Remplace par ton image de fond du template si tu l'as dans /public/assets/images/
           backgroundImage: 'linear-gradient(rgba(18, 18, 45, 0.7), rgba(18, 18, 45, 0)), url("/assets/images/bg-img/01.jpg")', 
           backgroundSize: 'cover',
           backgroundPosition: 'center'
         }}>
      
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-10 col-md-7 col-lg-5 col-xl-4">
            
            {/* La Carte avec un effet de profondeur */}
            <div className="card border-0 shadow-lg text-white" 
                 style={{ 
                   backgroundColor: 'rgba(45, 45, 91, 0.80)', 
                   borderRadius: '20px',
                   backdropFilter: 'blur(10px)'
                 }}>
              
              <div className="card-body p-5">
                <div className="text-center mb-5">
                  <h2 className="fw-bold display-6 mb-2">Rebel Refine</h2>
                  <p style={{ color: '#a5a5cc' }}>Trouvez votre partenaire idéal</p>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="form-label small text-uppercase fw-bold mb-2" style={{ color: '#f67280' }}>Email</label>
                    <input 
                      type="email" 
                      className="form-control form-control-lg border-0 text-white shadow-none"
                      style={{ backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="votre@email.com"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="form-label small text-uppercase fw-bold mb-2" style={{ color: '#f67280' }}>Mot de passe</label>
                    <input 
                      type="password" 
                      className="form-control form-control-lg border-0 text-white shadow-none"
                      style={{ backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                    />
                  </div>

                  {/* Bouton avec dégradé type Template */}
                  <button 
                    type="submit"
                    className="btn btn-lg w-100 fw-bold py-3 mt-3 text-white border-0"
                    style={{ 
                      background: 'linear-gradient(45deg, #f67280, #c06c84)', 
                      borderRadius: '12px',
                      boxShadow: '0 10px 20px rgba(246, 114, 128, 0.3)'
                    }}
                  >
                    SE CONNECTER
                  </button>
                </form>

                <div className="text-center mt-5">
                  <p className="mb-0" style={{ color: '#a5a5cc' }}>
                    Pas encore de compte ? <br/>
                    <span className="text-white fw-bold text-decoration-none border-bottom border-2 border-danger" 
                          style={{ cursor: 'pointer' }}>
                      Créer un compte gratuitement
                    </span>
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;