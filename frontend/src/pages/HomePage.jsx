import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import CountUp from "react-countup";


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

  // ÉTAPE 5: Affichage du préchargeur du template pendant l'appel API
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

                      <h6 className="mb-3">Vous recherchez une femme...</h6>
                      <form className="banner-form">
          
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
                                <option value="15">31</option>
                                <option value="16">32</option>
                                <option value="17">33</option>
                                <option value="18">34</option>
                                <option value="19">35</option>
                                <option value="20">36</option>
                                <option value="21">37</option>
                                <option value="22">38</option>
                                <option value="23">39</option>
                                <option value="24">40</option>
                                <option value="25">41</option>
                                <option value="26">42</option>
                                <option value="27">43</option>
                                <option value="28">44</option>
                                <option value="29">45</option>
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
                                <option value="15">31</option>
                                <option value="16">32</option>
                                <option value="17">33</option>
                                <option value="18">34</option>
                                <option value="19">35</option>
                                <option value="20">36</option>
                                <option value="21">37</option>
                                <option value="22">38</option>
                                <option value="23">39</option>
                                <option value="24">40</option>
                                <option value="25">41</option>
                                <option value="26">42</option>
                                <option value="27">43</option>
                                <option value="28">44</option>
                                <option value="29">45</option>
                                <option value="30">46</option>
                                <option value="31">47</option>
                                <option value="32">48</option>
                                <option value="33">49</option>
                                <option value="34">50</option>
                                <option value="35">51</option>
                                <option value="36">52</option>
                                <option value="37">53</option>
                                <option value="38">54</option>
                                <option value="39">55</option>
                                <option value="40">56</option>
                                <option value="41">57</option>
                                <option value="42">58</option>
                                <option value="43">59</option>
                                <option value="44">60</option>
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

        {/* ================ Member Section (Derniers inscrits BDD) =============== */}
            <section className="member-section padding-tb">
                <div className="container">
                    <div className="section-header">
                        <h2>Nos nouveaux membres</h2>
                        <p>Voici les derniers profils ayant rejoint Rebel Refine. Faites le premier pas !</p>
                    </div>
                    <div className="section-wrapper">
                        <div className="row justify-content-center g-3 g-md-4 row-cols-xl-5 row-cols-md-3 row-cols-1">
                            
                            {/* BOUCLE DYNAMIQUE SUR LAST_MEMBERS */}
                            {apiData?.last_members?.map((member) => (
                                <div className="col" key={member.id}>
                                    <div className="lab-item member-item style-1">
                                        <div className="lab-inner">
                                            <div className="lab-thumb">
                                                <Link to={`/profile/${member.id}`}>
                                                    <img 
                                                        src={member.gender === 'female' ? "assets/images/member/04.jpg" : "assets/images/member/03.jpg"} 
                                                        alt={member.nickname} 
                                                    />
                                                </Link>
                                            </div>
                                            <div className="lab-content">
                                                <h6>
                                                    <Link to={`/profile/${member.id}`}>
                                                        {member.nickname} <i className="icofont-check" title="Vérifié"></i>
                                                    </Link>
                                                </h6>
                                                <p>{member.age} ans</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                        </div>
                        <div className="member-button-group d-flex flex-wrap justify-content-center">
                            <Link to="/members" className="lab-btn"><span>Découvrir tous les membres</span></Link>
                        </div>
                    </div>
                </div>
            </section>
        {/* ================ Member Section end Here =============== */}
      

      {/* ================ About Section start Here =============== */}
      <section
        className="about-section padding-tb bgimg"
        style={{ backgroundImage: "url(assets/images/bg-img/01.jpg)" }}
      >
        <div className="container">
          <div className="section-header">
            <h2>Tout commence par une rencontre</h2>
            <p>
              Rejoignez une communauté grandissante et accédez à des milliers de
              profils.
            </p>
          </div>
          <div className="section-wrapper">
            <div className="row justify-content-center g-4">
              <div className="col-xl-3 col-lg-4 col-sm-6 col-12">
                <div className="lab-item about-item">
                  <div className="lab-inner text-center">
                    <div className="lab-thumb">
                      <img src="assets/images/about/01.png" alt="img" />
                    </div>
                    <div className="lab-content">
                      <h2 className="counter">
                        <CountUp end={apiData?.total_members || 0} separator="," duration={3} />
                      </h2>
                      <p>Membres au Total</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-3 col-lg-4 col-sm-6 col-12">
                <div className="lab-item about-item">
                  <div className="lab-inner text-center">
                    <div className="lab-thumb">
                      <img src="assets/images/about/02.png" alt="img" />
                    </div>
                    <div className="lab-content">
                      <h2 className="counter">
                        <CountUp end={apiData?.total_members || 0} separator="," duration={3} />
                      </h2>
                      <p>Membres en ligne</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-3 col-lg-4 col-sm-6 col-12">
                <div className="lab-item about-item">
                  <div className="lab-inner text-center">
                    <div className="lab-thumb">
                      <img src="assets/images/about/03.png" alt="img" />
                    </div>
                    <div className="lab-content">
                      <h2 className="counter">
                        <CountUp end={apiData?.count_males || 0} separator="," duration={3} />
                      </h2>
                      <p>Hommes en ligne</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-3 col-lg-4 col-sm-6 col-12">
                <div className="lab-item about-item">
                  <div className="lab-inner text-center">
                    <div className="lab-thumb">
                      <img src="assets/images/about/04.png" alt="img" />
                    </div>
                    <div className="lab-content">
                      <h2 className="counter">
                        <CountUp end={apiData?.count_females || 0} separator="," duration={3} />
                      </h2>
                      <p>Femmes en ligne</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* ================ About Section end Here =============== */}
    </>
  );
}

export default HomePage;
