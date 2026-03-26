import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useLanguage } from "../translations/hooks/useLanguage";
import { apiFetch } from "../api";
import "./SearchPage.css"; 
import Searcher from "../components/Searcher";


const SearchPage = () => {
    const [searchParams] = useSearchParams();
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalMembers, setTotalMembers] = useState(0);
    const { t } = useLanguage();

    useEffect(() => {
        const performSearch = async () => {
            setLoading(true);
            
            // 1. On récupère TOUS les critères depuis les searchParams
            const min = searchParams.get("min") || 18;
            const max = searchParams.get("max") || 60;
            const country = searchParams.get("country") || "";
            const marital = searchParams.get("marital") || "";
            const children = searchParams.get("children") || "";

            try {
                // 2. On construit l'URL avec tous les filtres pour ton apiFetch
                let url = `/api/members/females?min=${min}&max=${max}&page=${currentPage}`;
                
                if (country) url += `&country=${country}`;
                if (marital) url += `&marital=${marital}`;
                if (children !== "") url += `&children=${children}`;

                const response = await apiFetch(url);
                
                setMembers(response.data);
                setTotalPages(response.meta.pagesCount);
                setTotalMembers(response.meta.totalItems);
            } catch (error) {
                console.error("Erreur:", error.message);
                setMembers([]);
            } finally {
                setLoading(false);
            }
        };

        performSearch();
    }, [searchParams, currentPage]);

    if (loading) return <div className="text-center mt-5">{t.loading_profiles}</div>;

    return (
        <div className="search-page-container">
            <div className="container">
                {/* Header */}
                <div className="search-header">
                    <div>
                        <h2 className="search-title">
                            {t.search_results_title} <span className="search-accent">{t.search_results_subtitle}</span>
                        </h2>
                    </div>
                    <div className="text-end">
                        <span className="h4 fw-bold search-accent">{totalMembers}</span>
                        <span className="ms-2 text-uppercase small opacity-50 fw-bold">{t.members_unit}</span>
                    </div>
                </div>

                {/* Barre de recherche  */}
                <Searcher />

                {/* Grille de résultats */}
                <div className="row g-4">
                    {members.length > 0 ? (
                        members.map((member) => (
                            <div key={member.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
                                <div className="card border-0 shadow-lg custom-card">
                                    <div className="card-img-container">
                                        {member.photos && member.photos.length > 0 ? (
                                            <img 
                                                src={`http://localhost:8000/uploads/users/${member.photos[0]}`} 
                                                className="member-photo" 
                                                alt={member.nickname} 
                                            />
                                        ) : member.photo ? (
                                            <img 
                                                src={`http://localhost:8000/uploads/users/${member.photo}`} 
                                                className="member-photo" 
                                                alt={member.nickname} 
                                            />
                                        ) : (
                                            <div className="no-photo-placeholder">
                                                <i className="bi bi-person-circle"></i>
                                            </div>
                                        )}
                                    </div>
                                    <div className="card-body text-center pt-0 pb-4 px-4">
                                        <h5 className="fw-bold mb-4 text-white">
                                            {member.nickname}
                                            <span className="ms-2 fw-light opacity-50 small">
                                                • {member.age} {t.age_suffix}
                                            </span>
                                        </h5>
                                        <Link to={`/profile/${member.id}`} className="btn-discover-link">
                                            {t.search_btn_discover}
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-12 text-center py-5 opacity-25">
                            <p className="h5 fw-light">{t.search_no_results}</p>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="pagination-wrapper">
                        <button 
                            className="pagination-btn"
                            disabled={currentPage === 1}
                            onClick={() => { setCurrentPage(prev => prev - 1); window.scrollTo(0,0); }}
                        >
                            ‹
                        </button>
                        
                        <div className="pagination-info">
                            {currentPage} <span className="search-accent">/</span> {totalPages}
                        </div>

                        <button 
                            className="pagination-btn"
                            disabled={currentPage === totalPages}
                            onClick={() => { setCurrentPage(prev => prev + 1); window.scrollTo(0,0); }}
                        >
                            ›
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchPage;