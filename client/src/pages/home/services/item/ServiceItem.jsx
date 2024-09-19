import React, { useState } from 'react';

const ServiceItem = ({ title, description, icon }) => {
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    const cardStyle = {
        transform: isHovered ? 'scale(1.05)' : 'scale(1)',
        transition: 'transform 0.3s ease',
        overflow: 'hidden',
        borderRadius: '0.75rem',
        backgroundColor: 'darkslategray',
        color: 'white',
        padding: '1.25rem',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        height: '100%', // Ajout de cette ligne pour s'assurer que la carte occupe toute la hauteur de la colonne
    };

    const titleStyle = {
        fontSize: '1.25rem',
        fontWeight: 'bold',
    };

    return (
        <div className="col">
            <div className="card h-100" style={cardStyle} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                <div className="d-flex flex-column h-100">
                    <div className="mb-4">{icon}</div>
                    <h4 className="mb-4" style={titleStyle}>{title}</h4>
                    <p>{description}</p>
                </div>
            </div>
        </div>
    );
};

export default ServiceItem;
