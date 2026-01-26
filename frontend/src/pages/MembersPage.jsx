import { useEffect, useState } from 'react';

function MembersPage() {
    const [members, setMembers] = useState([]);

    useEffect(() => {
        fetch("http://localhost:8000/api/members/females", {
            headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
        })
        .then(res => res.json())
        .then(data => setMembers(data));
    }, []);

    return (
        <section className="member-section padding-tb">
            <div className="container">
                <div className="section-header">
                    <h2>Toutes nos membres féminines</h2>
                </div>
                <div className="row justify-content-center g-4 row-cols-xl-4 row-cols-md-3 row-cols-sm-2 row-cols-1">
                    {members.map((m) => (
                        <div className="col" key={m.id}>
                            <div className="lab-item member-item style-1">
                                <div className="lab-inner">
                                    <div className="lab-thumb">
                                        <img src="assets/images/member/02.jpg" alt="photo" />
                                    </div>
                                    <div className="lab-content">
                                        <h6>{m.nickname}</h6>
                                        <p>Interests</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default MembersPage;