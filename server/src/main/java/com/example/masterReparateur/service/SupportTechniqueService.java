package com.example.masterReparateur.service;

import com.example.masterReparateur.dto.SupportTechniqueResponse;
import com.example.masterReparateur.exception.MasterException;
import com.example.masterReparateur.models.SupportTechnique;
import com.example.masterReparateur.models.Role;
import com.example.masterReparateur.repository.SupportTechniqueRepo;
import lombok.AllArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class SupportTechniqueService {
	private final SupportTechniqueRepo supportTechniqueRepo;
	private final PasswordEncoder passwordEncoder;
	private SupportTechniqueRepo supportTechniqueRepository;

	public List<SupportTechniqueResponse> getAllSupportsTechnique() {
		List<SupportTechnique> supportsTechnique = supportTechniqueRepo.findAll(Sort.by(Sort.Direction.DESC, "id"));
		return supportsTechnique.stream().map(this::convertToResponse).collect(Collectors.toList());
	}

	public SupportTechniqueResponse getSupportTechniqueById(Long id) {
		Optional<SupportTechnique> optionalSupportTechnique = supportTechniqueRepo.findById(id);
		if (optionalSupportTechnique.isPresent()) {
			return convertToResponse(optionalSupportTechnique.get());
		} else {
			throw new MasterException("Support Technique introuvable", HttpStatus.NOT_FOUND);
		}
	}

	public SupportTechniqueResponse createSupportTechnique(SupportTechniqueResponse supportTechniqueResponse) {
		supportTechniqueResponse.setRole(Role.SUPPORT_TECHNIQUE);
		SupportTechnique supportTechnique = convertToEntity(supportTechniqueResponse);
		try {
			SupportTechnique savedSupportTechnique = supportTechniqueRepo.save(supportTechnique);
			return convertToResponse(savedSupportTechnique);
		} catch (Exception e) {
			throw new MasterException("Erreur lors de la création du Support Technique",
					HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	public SupportTechniqueResponse updateSupportTechnique(Long id, SupportTechniqueResponse supportTechniqueResponse) {
		Optional<SupportTechnique> optionalSupportTechnique = supportTechniqueRepo.findById(id);
		if (optionalSupportTechnique.isPresent()) {
			SupportTechnique existingSupportTechnique = optionalSupportTechnique.get();
			BeanUtils.copyProperties(supportTechniqueResponse, existingSupportTechnique, "id");
			existingSupportTechnique.setActive(true);
			SupportTechnique updatedSupportTechnique = supportTechniqueRepo.save(existingSupportTechnique);
			return convertToResponse(updatedSupportTechnique);
		} else {
			throw new MasterException("Support Technique introuvable", HttpStatus.NOT_FOUND);
		}
	}

	public void deleteSupportTechnique(Long id) {
		Optional<SupportTechnique> optionalSupportTechnique = supportTechniqueRepo.findById(id);
		if (optionalSupportTechnique.isPresent()) {
			supportTechniqueRepo.deleteById(id);
		} else {
			throw new MasterException("Support Technique introuvable", HttpStatus.NOT_FOUND);
		}
	}

	private SupportTechniqueResponse convertToResponse(SupportTechnique supportTechnique) {
		SupportTechniqueResponse supportTechniqueResponse = new SupportTechniqueResponse();
		BeanUtils.copyProperties(supportTechnique, supportTechniqueResponse);
		return supportTechniqueResponse;
	}

	private SupportTechnique convertToEntity(SupportTechniqueResponse supportTechniqueResponse) {
		SupportTechnique supportTechnique = new SupportTechnique();
		supportTechniqueResponse.setPassword(passwordEncoder.encode(supportTechniqueResponse.getPassword()));
		BeanUtils.copyProperties(supportTechniqueResponse, supportTechnique);
		return supportTechnique;
	}

}