package com.example.masterReparateur.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.masterReparateur.models.Blog;

public interface BlogRepo extends JpaRepository<Blog, Long> {

}