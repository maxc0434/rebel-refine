import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate();

  // --- ÉTAPE 1 : Initialisation des états ---
  // apiData contiendra le JSON envoyé par le HomeController (message, nickname, etc.)
  const [apiData, setApiData] = useState(null);
  // loading permet d'afficher un message d'attente pendant la requête réseau
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // --- ÉTAPE 2 : Récupération et vérification du Token ---
    const token = localStorage.getItem("token");

    // Si aucun token n'est trouvé, on redirige vers l'accueil (connexion)
    if (!token) {
      navigate("/");
      return;
    }

    // --- ÉTAPE 3 : Appel sécurisé vers Symfony (GET /api/home) ---
    fetch("http://localhost:8000/api/home", {
      method: "GET",
      headers: {
        // Transmission du Token dans les headers pour authentifier la requête
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        // Si le serveur répond autre chose que 200 OK (ex: 401 si le token a expiré)
        if (!response.ok) throw new Error("Session invalide");
        return response.json();
      })
      .then((data) => {
        // --- ÉTAPE 4 : Stockage des données de l'API ---
        setApiData(data); // On met à jour l'état avec les infos de l'utilisateur
        setLoading(false); // On retire l'écran de chargement
      })
      .catch((err) => {
        console.error("Erreur API:", err);
        // Sécurité : en cas d'erreur (token corrompu ou expiré), on vide tout et on déconnecte
        localStorage.clear();
        navigate("/");
      });
  }, [navigate]);

  // ÉTAPE : Affichage du préchargeur du template pendant l'appel API
  if (loading) {
    return (
      <div className="preloader">
        <div className="preloader-inner">
          <div className="preloader-icon">
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* ================ Banner Section start Here =============== */}
      <section
        className="banner-section bgimg"
        style={{ backgroundImage: "url(assets/images/banner/bg.jpg)" }}
      >
        <div className="container">
          <div className="section-wrapper">
            <div className="row align-items-end">
              <div className="col-lg-6">
                <div className="banner-content">
                  <div className="intro-form">
                    <div className="intro-form-inner">
                      {/* Utilisation du Nickname dynamique venant de l'API */}
                      <h2>
                        Ravi de vous revoir,{" "}
                        {apiData?.user_details?.nickname || "Aventurier"}.
                      </h2>
                      <p>Votre partenaire idéal n'est plus qu'à un clic.</p>

                      <h6 className="mb-3">Vous recherchez...</h6>
                      <form className="banner-form">
                        <div className="gender">
                          <div className="custom-select right">
                            <select>
                              <option value="0">Une connexion</option>
                              <option value="1">Homme</option>
                              <option value="2">Femme</option>
                            </select>
                          </div>
                        </div>
                        <div className="person">
                          <div className="custom-select right">
                            <select>
                              <option value="0">Avec</option>
                              <option value="1">Homme</option>
                              <option value="2">Femme</option>
                            </select>
                          </div>
                        </div>
                        <div className="age">
                          <div className="right d-flex justify-content-between w-100">
                            <div className="custom-select">
                              <select>
                                <option value="1">18</option>
                                <option value="2">19</option>
                                <option value="3">20</option>
                                <option value="4">21</option>
                                <option value="5">22</option>
                                <option value="6">23</option>
                                <option value="7">24</option>
                                <option value="8">25</option>
                                <option value="9">26</option>
                                <option value="10">27</option>
                                <option value="11">28</option>
                                <option value="13">29</option>
                                <option value="14">30</option>
                                <option value="15" selected>
                                  De
                                </option>
                              </select>
                            </div>
                            <div className="custom-select">
                              <select>
                                <option value="1">18+</option>
                                <option value="2">19</option>
                                <option value="3">20</option>
                                <option value="4">21</option>
                                <option value="5">22</option>
                                <option value="6">23</option>
                                <option value="7">24</option>
                                <option value="8">25</option>
                                <option value="9">26</option>
                                <option value="10">27</option>
                                <option value="11">28</option>
                                <option value="13">29</option>
                                <option value="14">30</option>
                                <option value="15" selected>
                                  To
                                </option>
                              </select>
                            </div>
                          </div>
                        </div>
                        <button type="submit">Trouver mon partenaire</button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* ================ Banner Section end Here =============== */}
    </>
  );
}

export default HomePage;
