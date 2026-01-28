import React, { useState } from 'react';

const ForgotPasswordPage = () => {
    // 1. État pour stocker l'email saisi par l'utilisateur
    const [email, setEmail] = useState('');

    // 2. État pour gérer l'affichage des messages (info, succès ou erreur)
    // On utilise un objet pour coupler le style (type) et le texte (msg)
    const [status, setStatus] = useState({ type: '', msg: '' });

    /**
     * Gestion de l'envoi du formulaire de demande
     */
    const handleSubmit = async (e) => {
        e.preventDefault(); // Empêche le rechargement de la page
        
        // On affiche un message d'attente
        setStatus({ type: 'info', msg: 'Envoi en cours...' });

        try {
            // 3. Appel à l'API Symfony pour générer le token et envoyer le mail
            const response = await fetch('http://localhost:8000/api/reset-password/request', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email }) // On transmet l'email au format JSON
            });

            const data = await response.json();

            // 4. On affiche le message de confirmation renvoyé par le contrôleur PHP
            setStatus({ type: 'success', msg: data.message });
        } catch (err) {
            // 5. Gestion des erreurs réseau (serveur éteint, problème de connexion, etc.)
            setStatus({ type: 'danger', msg: "Erreur lors de la communication avec le serveur." });
        }
    };

    return (
        <div className="container mt-5" style={{ maxWidth: '400px' }}>
            <h2 className="text-white mb-4">Mot de passe oublié</h2>
            {status.msg && <div className={`alert alert-${status.type}`}>{status.msg}</div>}
            
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="text-white-50">Votre adresse email</label>
                    <input 
                        type="email" 
                        className="form-control bg-dark text-white border-secondary"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required 
                    />
                </div>
                <button type="submit" className="btn btn-danger w-100 fw-bold">
                    Recevoir le lien
                </button>
            </form>
        </div>
    );
};

export default ForgotPasswordPage;