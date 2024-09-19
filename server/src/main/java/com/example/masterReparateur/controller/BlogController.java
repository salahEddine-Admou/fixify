package com.example.masterReparateur.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.masterReparateur.service.BlogService;

import lombok.AllArgsConstructor;

import com.example.masterReparateur.dto.BlogDto;

@RestController
@RequestMapping("/api/blogs")
@AllArgsConstructor
public class BlogController {
	private final BlogService blogService;

	@GetMapping
	public ResponseEntity<List<BlogDto>> getAllBlogs() {
		List<BlogDto> blogs = blogService.getAllBlogs();
		return new ResponseEntity<>(blogs, HttpStatus.OK);
	}

	@GetMapping("/{id}")
	public ResponseEntity<BlogDto> getBlogById(@PathVariable Long id) {
		BlogDto blog = blogService.getBlogById(id);
		return new ResponseEntity<>(blog, HttpStatus.OK);
	}

	@PostMapping
	public ResponseEntity<BlogDto> createBlog(@RequestBody BlogDto blogDTO) {
		BlogDto createdBlog = blogService.createBlog(blogDTO);
		return new ResponseEntity<>(createdBlog, HttpStatus.CREATED);
	}

	@PutMapping("/{id}")
	public ResponseEntity<BlogDto> updateBlog(@PathVariable Long id, @RequestBody BlogDto blogDTO) {
		BlogDto updatedBlog = blogService.updateBlog(id, blogDTO);
		return new ResponseEntity<>(updatedBlog, HttpStatus.OK);
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteBlog(@PathVariable Long id) {
		blogService.deleteBlog(id);
		return new ResponseEntity<>(HttpStatus.NO_CONTENT);
	}

}
