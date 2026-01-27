
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function ProfilePage() {
    const { id } = useParams(); // Récupère l'ID depuis l'URL
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`http://localhost:8000/api/profile/${id}`, {
            headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
        })
        .then(res => res.json())
        .then(data => {
            setProfile(data);
            setLoading(false);
        })
        .catch(err => console.error("Erreur profil:", err));
    }, [id]);

    if (loading) return <div className="preloader">...</div>;

    return (
        <section className="profile-section padding-tb">
            <div className="container">
                <div className="section-wrapper">
                    <div className="row justify-content-center">
                        <div className="col-lg-8">
                            <div className="lab-item member-item style-1">
                                <div className="lab-inner">
                                    <div className="lab-thumb">
                                        <img src={profile.gender === 'female' ? "/assets/images/member/04.jpg" : "/assets/images/member/03.jpg"} alt="profile" />
                                    </div>
                                    <div className="lab-content">
                                        <h4>{profile.nickname}, {profile.age} ans</h4>
                                        <p className="bio">{profile.interests}</p>
                                        
                                        <hr />
                                        
                                        <ul className="info-list" style={{ listStyle: 'none', padding: 0 }}>
                                            <li><strong>Situation :</strong> {profile.marital}</li>
                                            <li><strong>Enfants :</strong> {profile.children}</li>
                                            <li><strong>Religion :</strong> {profile.religion}</li>
                                        </ul>

                                        <button className="lab-btn mt-3">
                                            <span>Envoyer un message</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default ProfilePage;