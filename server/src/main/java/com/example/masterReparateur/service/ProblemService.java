package com.example.masterReparateur.service;

import com.example.masterReparateur.dto.PriceCSVDto;
import com.example.masterReparateur.dto.PriceRequest;
import com.example.masterReparateur.dto.PriceResponse;
import com.example.masterReparateur.dto.ProblemTypeDto;
import com.example.masterReparateur.dto.ProblemTypeResponse;
import com.example.masterReparateur.exception.*;
import com.example.masterReparateur.models.*;

import com.example.masterReparateur.repository.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.example.masterReparateur.repository.CategoryModelRepo;
import com.example.masterReparateur.repository.ModelRepo;
import com.example.masterReparateur.repository.PriceRepo;
import com.example.masterReparateur.repository.ProblemRepo;
import com.example.masterReparateur.repository.RepairerRepo;
import com.example.masterReparateur.repository.ReparationRepo;

import lombok.AllArgsConstructor;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.io.IOException;

import javax.persistence.EntityNotFoundException;
import javax.transaction.Transactional;

@Service
@AllArgsConstructor
public class ProblemService {
	private final ProblemRepo problemRepo;
	private final CategoryModelRepo categoryModelRepo;
	private final ModelRepo modelRepo;
	private final ReservationRepo reservationRepo;
	private final ReparationRepo reparationRepo;

	private final PriceRepo priceRepo;
	private final RepairerRepo repairerRepo;

	public List<ProblemTypeResponse> getAllProblems() {
		List<Problem> problems$ = problemRepo.findAll();
		List<ProblemTypeResponse> problems = problems$.stream().map(this::mapToDto).collect(Collectors.toList());
		return problems;
	}

	public Problem getProblemById(Long id) {
		Optional<Problem> optionalProblem = problemRepo.findById(id);
		if (optionalProblem.isPresent()) {
			return optionalProblem.get();
		} else {
			throw new MasterException("Problème introuvable", HttpStatus.NOT_FOUND);
		}
	}

	public ProblemTypeResponse createProblem(ProblemTypeDto problemRequest) {
		try {

			CategoryModel categoryModel = categoryModelRepo.findById(problemRequest.getCategoryId()).get();
			Problem problem = new Problem(problemRequest);
			problem.setCategoryModel(categoryModel);
			problem = problemRepo.save(problem);
			ProblemTypeResponse pTypeResponse = new ProblemTypeResponse(problem);
			return pTypeResponse;
		} catch (Exception e) {
			throw new MasterException("Erreur lors de la création du problème", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	public ProblemTypeResponse updateProblem(Long id, ProblemTypeDto problem) {
		Optional<Problem> optionalProblem = problemRepo.findById(id);
		CategoryModel categoryModel = categoryModelRepo.findById(problem.getCategoryId()).get();
		if (optionalProblem.isPresent()) {
			Problem existingProblem = optionalProblem.get();
			// Mise à jour des champs nécessaires
			existingProblem.setName(problem.getName());
			existingProblem.setDescription(problem.getDescription());
			existingProblem.setCategoryModel(categoryModel);
			existingProblem = problemRepo.save(existingProblem);
			ProblemTypeResponse pTypeResponse = new ProblemTypeResponse(existingProblem);
			return pTypeResponse;
		} else {
			throw new MasterException("Problème introuvable", HttpStatus.NOT_FOUND);
		}
	}

	public void deleteProblem(Long id) {
		Problem problem = problemRepo.findById(id)
				.orElseThrow(() -> new MasterException("Problem not found with id " + id, HttpStatus.NOT_FOUND));
		if (!reservationRepo.existsByReparationProblem(problem)) {
			problemRepo.deleteById(id);
			throw new MasterException("Problem supprimer avec succes", HttpStatus.OK);
		}
		throw new MasterException("Ce Problème a des réservations, vous ne pouvez pas le supprimer.",
				HttpStatus.NOT_FOUND);
	}

	public ProblemTypeResponse mapToDto(Problem problem) {
		return new ProblemTypeResponse(problem);
	}

	public List<ProblemTypeResponse> getModelProblems(Long id) {
		Model model = modelRepo.findById(id).get();
		List<Problem> problems$ = model.getSubCategoryModel().getCategoryModel().getProblems();
		List<ProblemTypeResponse> problems = problems$.stream().map(this::mapToDto).collect(Collectors.toList());
		return problems;

	}

	public void processExcelFile(MultipartFile file, String username) throws IOException {
		List<PriceCSVDto> priceRequests = parseExcelFile(file, username);
		for (PriceCSVDto priceRequest : priceRequests) {
			createPrice(priceRequest);
		}
	}

	public void createPrice(PriceCSVDto priceDto) {
		Model model;
		Problem problem;

		Optional<Model> optionalModel = modelRepo.findByName(priceDto.getModelName());
		if (!optionalModel.isPresent()) {
			System.out.println("modele not found");
			return; // Continue to the next iteration
		}
		model = optionalModel.get();

		Optional<Problem> optionalProblem = problemRepo.findByName(priceDto.getProblemName());
		if (!optionalProblem.isPresent()) {
			System.out.println("problen not found");

			return; // Continue to the next iteration
		}
		problem = optionalProblem.get();

		Repairer repairer = repairerRepo.findByUsername(priceDto.getUsername())
				.orElseThrow(() -> new EntityNotFoundException("Repairer not found"));

		Optional<Reparation> reparationOptional = reparationRepo
				.findByModelIdAndProblemIdAndRepairerUsername(model.getId(), problem.getId(), priceDto.getUsername());
		Reparation reparation = reparationOptional.orElse(new Reparation());

		reparation.setPrice(priceDto.getPrice());
		reparation.setModel(model);
		reparation.setProblem(problem);
		reparation.setRepairer(repairer);

		reparationRepo.save(reparation);
	}

	private List<PriceCSVDto> parseExcelFile(MultipartFile file, String username) throws IOException {
		List<PriceCSVDto> priceRequests = new ArrayList<>();

		try (Workbook workbook = new XSSFWorkbook(file.getInputStream())) {
			Sheet sheet = workbook.getSheetAt(0); // Assuming data is in the first sheet
			Iterator<Row> rows = sheet.iterator();

			// Skip the header row
			if (rows.hasNext()) {
				rows.next();
			}

			while (rows.hasNext()) {
				Row row = rows.next();
				PriceCSVDto priceRequest = new PriceCSVDto();

				priceRequest.setModelName(row.getCell(0).getStringCellValue());
				priceRequest.setProblemName(row.getCell(1).getStringCellValue());
				priceRequest.setPrice(row.getCell(2).getNumericCellValue());
				priceRequest.setUsername(username);
				System.out.println(priceRequest);
				priceRequests.add(priceRequest);
			}
		}

		return priceRequests;
	}

	@Transactional
	public void createPrices(PriceRequest priceDto) {

		Model model = modelRepo.findById(priceDto.getModelId())
				.orElseThrow(() -> new EntityNotFoundException("Problem not found"));

		// Iterate through prices and problemIds lists to create Price entities
		List<Reparation> reparations = new ArrayList<>();
		for (int i = 0; i < priceDto.getPrices().size(); i++) {

			Double priceValue = priceDto.getPrices().get(i);
			Long problemId = priceDto.getProblemsIds().get(i);
			Repairer repairer = repairerRepo.findByUsername(priceDto.getUsername()).get();

			// Fetch Model entity from its ID
			Problem problem = problemRepo.findById(problemId)
					.orElseThrow(() -> new EntityNotFoundException("Model not found"));

			Optional<Reparation> priceOptional = reparationRepo.findByModelIdAndProblemIdAndRepairerUsername(
					priceDto.getModelId(), problemId, priceDto.getUsername());
			Reparation reparation = priceOptional.orElse(new Reparation()); // Provide a default Price

			// Now you can use the 'price' object, which will be the fetched Price if it
			// exists, or a new Price object if it doesn't.
			reparation.setPrice(priceValue);
			reparation.setModel(model);
			reparation.setProblem(problem);
			reparation.setRepairer(repairer);
			reparations.add(reparation);

			// Create and save Price entity

		}

		reparationRepo.saveAll(reparations);

	}

	public PriceResponse getProblemPrice(Long modelId, Long problemId, Long repairerId) {
		Reparation reparation = reparationRepo.findByModelIdAndProblemIdAndRepairerId(modelId, problemId, repairerId)
				.get();
		return new PriceResponse(reparation);

	}

	public boolean checkAvailable(String name, Long id) {
		if (name != "" && id != null) {
			Optional<Problem> problem = problemRepo.findByNameAndCategoryModelId(name, id);
			return problem.isPresent();
		} else {
			return false;
		}
	}
}
