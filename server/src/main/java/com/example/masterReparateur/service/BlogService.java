package com.example.masterReparateur.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;

import com.example.masterReparateur.repository.BlogRepo;
import com.example.masterReparateur.repository.ModelRepo;
import com.example.masterReparateur.repository.ProblemRepo;
import com.example.masterReparateur.dto.BlogDto;
import com.example.masterReparateur.dto.ProblemTypeResponse;
import com.example.masterReparateur.models.Blog;
import com.example.masterReparateur.models.Model;
import com.example.masterReparateur.models.Problem;

@Service
public class BlogService {
	private final BlogRepo blogRepo;
	private final ModelRepo modelRepo;
	private final ProblemRepo problemRepo;

	public BlogService(BlogRepo blogRepo, ModelRepo modelRepo, ProblemRepo problemRepo) {
		this.blogRepo = blogRepo;
		this.modelRepo = modelRepo;
		this.problemRepo = problemRepo;
	}

	public List<BlogDto> getAllBlogs() {
		return blogRepo.findAll().stream().map(this::convertToDto).collect(Collectors.toList());
	}

	public BlogDto getBlogById(Long id) {
		Optional<Blog> blog = blogRepo.findById(id);

		return blog.map(this::convertToDto).orElseThrow(() -> new RuntimeException("Blog not found"));
	}

	public BlogDto createBlog(BlogDto blogDTO) {
		Blog blog = new Blog();
		blog.setName(blogDTO.getName());
		blog.setDescription(blogDTO.getDescription());
		blog.setImageblog(blogDTO.getImageBlog());
		blog.setModel(getModelById(blogDTO.getModelId()));
		blog.setProblem(getProblemById(blogDTO.getProblemId()));
		Blog savedBlog = blogRepo.save(blog);
		return convertToDto(savedBlog);
	}

	public BlogDto updateBlog(Long id, BlogDto blogDTO) {
		Blog blog = blogRepo.findById(id).orElseThrow(() -> new RuntimeException("Blog not found"));
		blog.setName(blogDTO.getName());
		blog.setDescription(blogDTO.getDescription());
		blog.setImageblog(blogDTO.getImageBlog());
		blog.setModel(getModelById(blogDTO.getModelId()));
		blog.setProblem(getProblemById(blogDTO.getProblemId()));
		Blog updatedBlog = blogRepo.save(blog);
		return convertToDto(updatedBlog);
	}

	public void deleteBlog(Long id) {
		blogRepo.deleteById(id);
	}

	private BlogDto convertToDto(Blog blog) {
		BlogDto blogDto = new BlogDto();
		blogDto.setId(blog.getId());
		blogDto.setName(blog.getName());
		blogDto.setDescription(blog.getDescription());
		blogDto.setImageBlog(blog.getImageblog());
		blogDto.setModelId(blog.getModel().getId());
		blogDto.setModel(blog.getModel().getName());
		blogDto.setProblemId(blog.getProblem().getId());
		blogDto.setProblem(blog.getProblem().getName());
		return blogDto;
	}

	private Model getModelById(Long modelId) {
		return modelRepo.findById(modelId).orElseThrow(() -> new RuntimeException("Model non trouvé"));
	}

	private Problem getProblemById(Long problemId) {
		return problemRepo.findById(problemId).orElseThrow(() -> new RuntimeException("Problem non trouvé"));
	}
}
