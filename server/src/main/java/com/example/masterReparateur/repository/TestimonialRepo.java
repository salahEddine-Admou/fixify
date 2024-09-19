
package com.example.masterReparateur.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.masterReparateur.models.Testimonial;

public interface TestimonialRepo extends JpaRepository<Testimonial, Long> {
}
