package com.example.masterReparateur.service;

import com.example.masterReparateur.dto.ModelResponse;
import com.example.masterReparateur.dto.PriceResponse;

import com.example.masterReparateur.dto.ModelRequest;
import com.example.masterReparateur.exception.MasterException;
import com.example.masterReparateur.models.Model;
import com.example.masterReparateur.models.Price;
import com.example.masterReparateur.models.Reparation;
import com.example.masterReparateur.models.SubCategoryModel;
import com.example.masterReparateur.repository.ModelRepo;
import com.example.masterReparateur.repository.ReservationRepo;
import com.example.masterReparateur.repository.ReparationRepo;
import com.example.masterReparateur.repository.SubCategoryModelRepo;

import lombok.AllArgsConstructor;

import com.example.masterReparateur.repository.CategoryModelRepo;
import org.springframework.beans.BeanUtils;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import javax.persistence.EntityNotFoundException;

@Service
@AllArgsConstructor
public class ModelService {

	private final ModelRepo modelRepo;
	private final CategoryModelRepo categoryModelRepo;
	private final SubCategoryModelRepo subCategoryModelRepo;
	private final ReservationRepo reservationRepo;
	private final ReparationRepo reparationRepo;

	public List<ModelResponse> getAllModels() {
		List<Model> models = modelRepo.findAll();
		return models.stream().map(this::mapToDto).collect(Collectors.toList());
	}

	public Model getModelById(Long id) {
		Optional<Model> optionalModel = modelRepo.findById(id);
		return optionalModel.orElseThrow(() -> new MasterException("Modèle introuvable", HttpStatus.NOT_FOUND));
	}

	public ModelResponse create(ModelRequest modelRequest) {
		try {
			Model model = new Model(modelRequest);
			SubCategoryModel subsCategoryModel = subCategoryModelRepo.findById(modelRequest.getSubcategoryId())
					.orElseThrow(() -> new MasterException("Sous-catégorie introuvable", HttpStatus.NOT_FOUND));

			model.setSubCategoryModel(subsCategoryModel);

			Model savedModel = modelRepo.save(model);
			ModelResponse modelResponse = new ModelResponse(savedModel);
			return modelResponse;
		} catch (Exception e) {
			throw new MasterException("Erreur lors de la création du modèle", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	public ModelResponse updateModel(Long id, ModelRequest modelRequest) {

		Optional<Model> optionalModel = modelRepo.findById(id);
		if (optionalModel.isPresent()) {
			Model existingModel = optionalModel.get();
			existingModel.setName(modelRequest.getName());
			existingModel.setDescription(modelRequest.getDescription());
			existingModel.setSubCategoryModel(subCategoryModelRepo.findById(modelRequest.getSubcategoryId())
					.orElseThrow(() -> new MasterException("Sous-catégorie introuvable", HttpStatus.NOT_FOUND)));
			Model updatedModel = modelRepo.save(existingModel);
			return mapToDto(updatedModel);
		} else {
			throw new MasterException("Modèle introuvable", HttpStatus.NOT_FOUND);
		}
	}

	public void deleteModel(Long id) {
		Model model = modelRepo.findById(id)
				.orElseThrow(() -> new MasterException("Model not found with id " + id, HttpStatus.NOT_FOUND));
		if (!reservationRepo.existsByReparationModel(model)) {

			modelRepo.deleteById(id);
			throw new MasterException("Model supprimer avec succes ", HttpStatus.OK);
		}
		throw new MasterException("Ce Modèle de Produit a des réservations, vous ne pouvez pas le supprimer.",
				HttpStatus.NOT_FOUND);
	}

	public ModelResponse mapToDto(Model model) {
		return new ModelResponse(model);
	}

	public List<PriceResponse> getPricesByModel(Long modelId, String username) {
		List<PriceResponse> prices = reparationRepo.findAllByModelIdAndRepairerUsername(modelId, username).stream()
				.map(this::mapToPriceRes).collect(Collectors.toList());

		// Fetch prices associated with the model

		return prices;
	}

	private PriceResponse mapToPriceRes(Reparation reparation) {
		return new PriceResponse(reparation);
	}

	public List<Model> findAllModelsByProblemIdAndPrice(Long problemId) {
		return modelRepo.findAllModelsByProblemId(problemId);
	}

	public boolean checkAvailable(String name) {
		if (name != "") {
			Optional<Model> model = modelRepo.findByName(name);
			return model.isPresent();
		} else {
			return false;
		}
	}
}
