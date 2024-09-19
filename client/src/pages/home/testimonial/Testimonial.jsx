// Testimonials.jsx
import React, { useState, useEffect, useRef } from 'react';
import TestimonialApi from '../../../api/testimonialApi';
import TestimonialItem from './item/testimonialItem';


const Testimonials = () => {
    const [testimonials, setTestimonials] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const carouselRef = useRef(null);

    useEffect(() => {
        const fetchTestimonials = async () => {
            try {
                const response = await TestimonialApi.getAll();
                setTestimonials(response.data);
            } catch (error) {
                console.error('Erreur lors de la récupération des témoignages:', error);
            }
        };

        fetchTestimonials();
    }, []);

    useEffect(() => {
        const intervalId = setInterval(() => {
            if (carouselRef.current) {
                carouselRef.current.scrollBy({ left: 300, behavior: 'smooth' });
                setCurrentIndex(prevIndex => (prevIndex + 3) % testimonials.length);
            }
        }, 5000);

        return () => clearInterval(intervalId);
    }, [testimonials.length]);

    // Duplicate testimonials to simulate infinite scrolling
    const testimonialsToShow = [...testimonials, ...testimonials, ...testimonials];
    const currentTestimonials = testimonialsToShow.slice(currentIndex, currentIndex + 3);

    return (
        <div className="testimonials-container">
            <div className="relative mx-auto mt-10 grid max-w-lg grid-cols-1 gap-6 md:max-w-none md:grid-cols-3 lg:gap-10" ref={carouselRef}>
                {currentTestimonials.map((testimonial) => (
                    <div key={testimonial.id} >
                        <TestimonialItem
                            id={testimonial.id}
                            title={testimonial.title}
                            description={testimonial.description}
                            fullname={testimonial.fullName}
                            job={testimonial.job}
                            initialRating={testimonial.rating}
                            
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Testimonials;
