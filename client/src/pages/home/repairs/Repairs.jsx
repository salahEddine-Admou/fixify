import React, { useState, useEffect, useRef } from 'react';
import RepairsItem from "./item/RepairsItem";
import RepairerApi from '../../../api/repairerApi'; // Assurez-vous que le chemin vers RepairerApi est correct

const Repairs = () => {
    const [repairers, setRepairers] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [itemsPerView, setItemsPerView] = useState(3);
    const carouselRef = useRef(null);

    useEffect(() => {
        const fetchRepairers = async () => {
            try {
                const response = await RepairerApi.getTopRepairers(); // Appel de la méthode getAll de votre API
                setRepairers(response.data); // Met à jour les données des réparateurs dans l'état
            } catch (error) {
                console.error('Erreur lors de la récupération des données des réparateurs:', error);
            }
        };

        fetchRepairers(); // Appel de la fonction pour récupérer les données des réparateurs
    }, []);

    useEffect(() => {
        const updateItemsPerView = () => {
            if (window.innerWidth >= 1024) {
                setItemsPerView(3);
            } else if (window.innerWidth >= 768) {
                setItemsPerView(2);
            } else {
                setItemsPerView(1);
            }
        };

        window.addEventListener('resize', updateItemsPerView);
        updateItemsPerView();

        return () => window.removeEventListener('resize', updateItemsPerView);
    }, []);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + itemsPerView) % repairers.length);
        }, 5000);

        return () => clearInterval(intervalId);
    }, [repairers.length, itemsPerView]);

    const currentRepairers = repairers.slice(currentIndex, currentIndex + itemsPerView).concat(
        repairers.slice(0, Math.max(0, (currentIndex + itemsPerView) - repairers.length))
    );

    return (
        <div>
            <h2 className="fw-bolder md:text-2xl text-base title pb-2 w-fit relative">Reparateurs recommandés</h2>
            <div className="carousel overflow-hidden" ref={carouselRef}>
                <div className="flex space-x-4">
                    {currentRepairers.map((repairer, index) => (
                        <RepairsItem
                            key={index}
                            repairer={repairer}
                            itemsPerView={itemsPerView}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Repairs;
