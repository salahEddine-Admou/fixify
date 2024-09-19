import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RepairerProfile = ({ repairerId }) => {
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get(`/api/repairers/${repairerId}/profile`);
                setProfile(response.data);
            } catch (error) {
                console.error('Erreur lors de la récupération du profil du réparateur:', error);
            }
        };

        fetchProfile();
    }, [repairerId]);

    if (!profile) {
        return <div>Chargement...</div>;
    }

    return (
        <div>
            <h2>{profile.nom} {profile.prenom}</h2>
            <p>Genre: {profile.genre}</p>
            <p>Description: {profile.description}</p>
            <p>Nombre total des réservations avec succès: {profile.reservationsAvecSucces}</p>
            <p>Nombre total des modèles résolus: {profile.modelesResolus}</p>
            {/* Affichez d'autres informations du profil si nécessaire */}
        </div>
    );
};

export default RepairerProfile;
