package com.example.masterReparateur.service;

import com.example.masterReparateur.dto.ModelResponse;
import com.example.masterReparateur.dto.ProblemModelRequest;
import com.example.masterReparateur.dto.ProblemTypeDto;
import com.example.masterReparateur.dto.ProblemTypeResponse;
import com.example.masterReparateur.dto.RegisterRequest;
import com.example.masterReparateur.dto.RepairerDto;
import com.example.masterReparateur.dto.RepairerProfileDto;
import com.example.masterReparateur.dto.ReparationRequest;
import com.example.masterReparateur.dto.ReparationResponse;
import com.example.masterReparateur.dto.SearchDto;

import com.example.masterReparateur.exception.MasterException;
import com.example.masterReparateur.models.*;
import com.example.masterReparateur.repository.*;
import org.apache.poi.ss.usermodel.*;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import javax.persistence.*;

import lombok.AllArgsConstructor;
import springfox.documentation.swagger2.mappers.ModelMapper;

import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class RepairerService {
	private final RepairerRepo repairerRepo;
	private CinPhotoRepo cinPhotoRepo;
	private final PasswordEncoder passwordEncoder;
	private final MailService mailService;
	private final VerificationTokenRepository verificationTokenRepository;
	private final ReparationRepo reparationRepo;
	private final ProblemRepo problemRepo;
	private final ModelRepo modelRepo;
	private final UserRepository userRepository;
	private final ClientRepo clientRepo;
	private final RepairerFavorisRepo repairerFavorisRepo;

	private final ReservationRepo reservationRepo;
	private final PortfolioRepo portfolioRepo;

	private Set<String> existingUsernames = new HashSet<>();
	private Set<String> existingCins = new HashSet<>();
	private Set<String> existingEmails = new HashSet<>();
	private Set<String> existingRibs = new HashSet<>();

	public List<Repairer> getAllRepairers() {
		List<Repairer> repairers = repairerRepo.findAll();
		return repairers;
	}

	public List<Repairer> getAllProRepairers() {
		List<Repairer> repairers = repairerRepo.findAllProRepairers();
		return repairers != null ? repairers : new ArrayList<>();
	}

	public RepairerDto getRepairerById(Long id) {
		Optional<Repairer> optionalRepairer = repairerRepo.findById(id);
		if (optionalRepairer.isPresent()) {
			return convertToDto(optionalRepairer.get());
		} else {
			throw new MasterException("Réparateur introuvable", HttpStatus.NOT_FOUND);
		}
	}

	public RepairerDto createRepairer(RepairerDto repairerDTO) {
		repairerDTO.setRole(Role.REPAIRER);
		Repairer repairer = convertToEntity(repairerDTO);

		try {
			Repairer savedRepairer = repairerRepo.save(repairer);
			return convertToDto(savedRepairer);
		} catch (Exception e) {
			throw new MasterException("Erreur lors de la création du Réparateur", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@Transactional
	public RepairerDto updateRepairer(Long id, RepairerDto repairerDto) {
		Repairer existingRepairer = repairerRepo.findById(id)
				.orElseThrow(() -> new EntityNotFoundException("Repairer not found"));
		existingRepairer = convertToRepairer(existingRepairer, repairerDto);
		existingRepairer.setRole(Role.REPAIRER);
		existingRepairer.setEmailVerified(true);
		existingRepairer.setActive(true);
		Repairer updatedRepairer = repairerRepo.save(existingRepairer);
		if (!repairerDto.getImagePortfolio().isEmpty()) {
			portfolioRepo.deleteAllByRepairerId(id);
			for (String img : repairerDto.getImagePortfolio()) {
				Optional<Portfolio> optionalPortfolio = portfolioRepo.findBySrc(img);
				if (optionalPortfolio.isPresent()) {
					Portfolio portfolio = optionalPortfolio.get();
					portfolio.setRepairer(updatedRepairer);
					portfolioRepo.save(portfolio);
				} else {
					Portfolio portfolio = new Portfolio();
					portfolio.setSrc(img);
					portfolio.setRepairer(updatedRepairer);
					portfolioRepo.save(portfolio);
				}
			}
		}
		return convertToDto(updatedRepairer);
	}

	@Transactional
	public void deleteRepairer(Long id) {
		Optional<Repairer> optionalRepairer = repairerRepo.findById(id);
		if (optionalRepairer.isPresent()) {
			repairerRepo.deleteById(id);
		} else {
			throw new MasterException("Réparateur introuvable", HttpStatus.NOT_FOUND);
		}
	}

	@Transactional
	public void signup(RepairerDto repairerDto) {
		repairerDto.setRole(Role.REPAIRER);
		repairerDto.setActive(false);
		repairerDto.setEmailVerified(false);
		repairerDto.setPassword(passwordEncoder.encode(repairerDto.getPassword()));
		Repairer repairer = convertToEntity(repairerDto);
		try {
			repairerRepo.save(repairer);
			for (String img : repairerDto.getImageIdentity()) {
				CinPhoto cinPhoto = cinPhotoRepo.findBySrc(img).get();
				cinPhoto.setRepairer(repairer);
				cinPhotoRepo.save(cinPhoto);
			}
			String token = generateVerificationToken(repairer);
			mailService.sendMail(new NotificationEmail("Please activate ur acount", repairer.getEmail(),
					"Click to this link to activate ur email: http://localhost:3000/auth/accountverification/"
							+ token));
		} catch (Exception e) {
			throw new MasterException("Erreur lors de la création du Réparateur", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	private String generateVerificationToken(User user) {
		String token = UUID.randomUUID().toString();
		VerificationToken verificationToken = new VerificationToken();
		verificationToken.setToken(token);
		verificationToken.setUser(user);
		verificationTokenRepository.save(verificationToken);
		return token;
	}

	private RepairerDto convertToDto(Repairer repairer) {
		RepairerDto repairerDTO = new RepairerDto();
		BeanUtils.copyProperties(repairer, repairerDTO);
		return repairerDTO;
	}

	private Repairer convertToEntity(RepairerDto repairerDTO) {
		Repairer repairer = new Repairer();
		BeanUtils.copyProperties(repairerDTO, repairer);
		return repairer;
	}

	public List<Reparation> createReparations(ReparationRequest reparationRequest, Long repairerId) {
		// List<Reparation> reparations = new ArrayList<>();
		// Repairer repairer = repairerRepo.findById(repairerId).get();
		// for (ProblemModelRequest problemModel : reparationRequest.getProblems()) {
		// Long problemType = problemModel.getProblemType();
		// List<Integer> models = problemModel.getModels();
		// for (int i = 0; i < models.size(); i++) {
		// System.out.println("model id type" + models.get(i).getClass());
		// Problem problem = problemRepo.findById(problemType).get();
		// Model model = modelRepo.findById((long) models.get(i)).get();
		// Price price = priceRepo.findByModelAndProblem(model, problem).get();
		// Reparation reparation = new Reparation();
		// reparation.setModel(model);
		// reparation.setProblem(problem);
		// reparation.setPrice(i);
		// reparation.setRepairer(repairer);
		// reparations.add(reparation);
		// }
		// }
		// return reparationRepo.saveAll(reparations);
		return null;
	}

	public List<ReparationResponse> getReparations(Long repairerId) {

		Repairer repairer = repairerRepo.findById(repairerId).get();
		List<Reparation> reparataions = reparationRepo.findByRepairer(repairer);
		Map<Problem, List<Model>> reapaartions = getModelsGroupedByProblemType(reparataions);
		List<ReparationResponse> reparationResponses = new ArrayList<>();
		for (Map.Entry<Problem, List<Model>> entry : reapaartions.entrySet()) {
			ReparationResponse reparationResponse = new ReparationResponse();
			ProblemTypeResponse problem = new ProblemTypeResponse(entry.getKey());
			List<ModelResponse> models = entry.getValue().stream().map(this::mapToModelRes)
					.collect(Collectors.toList());
			List<ModelResponse> smodels = modelRepo.findAllModelsByProblemId(problem.getId()).stream()
					.map(this::mapToModelRes).collect(Collectors.toList());
			reparationResponse.setModels(models);
			reparationResponse.setSelectedModels(smodels);
			reparationResponse.setProblem(problem);
			reparationResponses.add(reparationResponse);

		}
		return reparationResponses;

	}

	public ModelResponse mapToModelRes(Model model) {
		return new ModelResponse(model);
	}

	public Map<Problem, List<Model>> getModelsGroupedByProblemType(List<Reparation> reparations) {
		// Map<Problem, List<Model>> modelsByProblemType = new HashMap<>();

		// for (Reparation reparation : reparations) {
		// Price price = reparation.getPrice();
		// Problem problem = price.getProblem();
		// Model model = price.getModel();

		// // Get or create the list of models for this problem type
		// List<Model> models = modelsByProblemType.computeIfAbsent(problem, k -> new
		// ArrayList<>());

		// // Add the model to the list
		// models.add(model);
		// }

		// return modelsByProblemType;

		return null;
	}

	public List<RepairerProfileDto> getQualifiedRepairers(SearchDto searchDto, int page, int size) {

		List<Repairer> repairers = repairerRepo.getReapairersByModelAndProblemTypeAndCity(searchDto.getModelId(),
				searchDto.getProblemId(), searchDto.getCity(), PageRequest.of(page - 1, size)).stream()
				.collect(Collectors.toList());
		List<RepairerProfileDto> repairerProfileDtos = new ArrayList<>();

		for (Repairer repairer : repairers) {
			List<Reparation> reparations = reparationRepo.findByRepairer(repairer);
			List<Reservation> reservations = reservationRepo.findByRepairer(repairer);

			// You may want to add a condition to skip repairers with no reparations,
			// similar to the original code
			Reparation reparation = reparationRepo.findByModelIdAndProblemIdAndRepairerUsername(searchDto.getModelId(),
					searchDto.getProblemId(), repairer.getUsername()).get();

			double price = reparation.getPrice();

			RepairerProfileDto repairerProfileDto = convertToRepairerProfileDto(repairer, reparations, reservations,
					price);
			repairerProfileDtos.add(repairerProfileDto);
		}

		return repairerProfileDtos;

	}

	private RepairerDto mapToRepairerDto(Repairer repairer) {
		return new RepairerDto(repairer);
	}

	private RepairerDto mapFavorisToRepairerDto(RepairerFavoris repairerFavoris) {
		return new RepairerDto(repairerFavoris.getRepairer());
	}

	public void supprimerReparationsParReparateur(Long reparateurId) {
		repairerRepo.deleteByReparateurId(reparateurId);
	}

	public void enablePro(Long repairerId) {
		Optional<Repairer> optionalRepairer = repairerRepo.findById(repairerId);
		if (optionalRepairer.isPresent()) {
			Repairer repairer = optionalRepairer.get();
			repairer.setPro(true);
			repairerRepo.save(repairer);
		} else {
			throw new MasterException("Repairer introuvable", HttpStatus.NOT_FOUND);
		}
	}

	public void disablePro(Long repairerId) {
		Optional<Repairer> optionalRepairer = repairerRepo.findById(repairerId);
		if (optionalRepairer.isPresent()) {
			Repairer repairer = optionalRepairer.get();
			repairer.setPro(false);
			repairerRepo.save(repairer);
		} else {
			throw new MasterException("Repairer introuvable", HttpStatus.NOT_FOUND);
		}
	}

	public RepairerProfileDto getRepairerProfile(Long repairerId) {
		Repairer repairer = repairerRepo.findById(repairerId).get();
		List<Reparation> reparations = reparationRepo.findByRepairer(repairer);
		List<Reservation> reservations = reservationRepo.findByRepairer(repairer);

		RepairerProfileDto repairerProfileDto = convertToRepairerProfileDto(repairer, reparations, reservations, 0);
		return repairerProfileDto;
	}

	public Map<String, List<?>> extractModelsAndProblems(List<Reparation> reparations) {
		// Using Set to avoid duplicates
		Set<ModelResponse> modelSet = new HashSet<>();
		Set<ProblemTypeResponse> problemSet = new HashSet<>();

		for (Reparation reparation : reparations) {
			modelSet.add(new ModelResponse(reparation.getModel()));
			if (reparation.getProblem() != null) {
				problemSet.add(new ProblemTypeResponse(reparation.getProblem()));
			}
		}

		// Convert sets to lists
		List<ModelResponse> models = new ArrayList<>(modelSet);
		List<ProblemTypeResponse> problems = new ArrayList<>(problemSet);

		// Create a map to hold the results
		Map<String, List<?>> result = new HashMap<>();
		result.put("models", models);
		result.put("problems", problems);

		return result;

	}

	private RepairerProfileDto convertToRepairerProfileDto(Repairer repairer, List<Reparation> reparations,
			List<Reservation> reservations, double price) {
		RepairerProfileDto repairerProfileDto = new RepairerProfileDto();
		repairerProfileDto.setId(repairer.getId());
		repairerProfileDto.setFirstName(repairer.getFirstName());
		repairerProfileDto.setPrice(price);
		repairerProfileDto.setLastName(repairer.getLastName());
		repairerProfileDto.setGender(repairer.isGender());
		repairerProfileDto.setCity(repairer.getCity());
		repairerProfileDto.setDescription(repairer.getDescription());
		repairerProfileDto.setProfilePhoto(repairer.getImageProfile());
		if (repairer.getReviews() != null) {
			repairerProfileDto.setReviews(repairer.getReviews());
		} else {
			repairerProfileDto.setReviews(new ArrayList<>()); // Ou null selon votre besoin
		}
		repairerProfileDto.setTotalModels(reparations.size());
		repairerProfileDto.setPortfolios(repairer.getPortfolios());
		repairerProfileDto.setPro(repairer.isPro());
		repairerProfileDto.setReparations(extractModelsAndProblems(repairer.getReparations()));
		repairerProfileDto.setTotalSuccessfulReservations(reservations.size());
		return repairerProfileDto;
	}

	public Repairer findRepairerByUsername(String username) {
		Optional<Repairer> optionalRepairer = repairerRepo.findByUsername(username);
		if (optionalRepairer.isPresent()) {
			System.out.println(optionalRepairer.get().getPassword());
			return optionalRepairer.get();
		} else {
			throw new MasterException("Réparateur introuvable pour le nom d'utilisateur: " + username,
					HttpStatus.NOT_FOUND);
		}
	}

	public void makeRepairerDispo(Long id) {
		Optional<Repairer> optionalRepairer = repairerRepo.findById(id);
		if (optionalRepairer.isPresent()) {
			Repairer repairer = optionalRepairer.get();
			repairer.setDisonible(true);
			repairerRepo.save(repairer);
		} else {
			throw new MasterException("Repairer introuvable", HttpStatus.NOT_FOUND);
		}
	}

	public void makeRepairerNonDispo(Long id) {
		Optional<Repairer> optionalRepairer = repairerRepo.findById(id);
		if (optionalRepairer.isPresent()) {
			Repairer repairer = optionalRepairer.get();
			repairer.setDisonible(false);
			repairerRepo.save(repairer);
		} else {
			throw new MasterException("Repairer introuvable", HttpStatus.NOT_FOUND);
		}
	}

	public boolean checkAvailableCin(String cin) {
		if (cin != "") {
			Optional<Repairer> repairer = repairerRepo.findByCin(cin);
			return repairer.isPresent();
		} else {
			return false;
		}
	}

	public boolean checkAvailableRib(String rib) {
		if (rib != "") {
			Optional<Repairer> repairer = repairerRepo.findByRib(rib);
			return repairer.isPresent();
		} else {
			return false;
		}
	}

	public boolean existsByRepairerIdAndModelId(Long repairerId, Long modelId) {
		return reparationRepo.existsByRepairer_IdAndModel_Id(repairerId, modelId);
	}

	private List<Repairer> parseExcelFile(MultipartFile file) throws IOException {
		List<Repairer> dataList = new ArrayList<>();
		Workbook workbook = WorkbookFactory.create(file.getInputStream());
		Sheet sheet = workbook.getSheetAt(0);
		boolean firstRow = true;
		int usernameCol = -1, firstNameCol = -1, lastNameCol = -1, genderCol = -1, addressCol = -1, phoneCol = -1,
				cityCol = -1, emailCol = -1, passwordCol = -1, cinCol = -1, ribCol = -1;

		// Trouver les indices des colonnes en fonction des noms
		Row firstRowData = sheet.getRow(0);
		for (Cell cell : firstRowData) {
			String columnName = getCellValueAsString(cell);
			switch (columnName.toLowerCase()) {
			case "username":
				usernameCol = cell.getColumnIndex();
				break;
			case "firstname":
				firstNameCol = cell.getColumnIndex();
				break;
			case "lastname":
				lastNameCol = cell.getColumnIndex();
				break;
			case "gender":
				genderCol = cell.getColumnIndex();
				break;
			case "address":
				addressCol = cell.getColumnIndex();
				break;
			case "phone":
				phoneCol = cell.getColumnIndex();
				break;
			case "city":
				cityCol = cell.getColumnIndex();
				break;
			case "email":
				emailCol = cell.getColumnIndex();
				break;
			case "password":
				passwordCol = cell.getColumnIndex();
				break;
			case "cin":
				cinCol = cell.getColumnIndex();
				break;
			case "rib":
				ribCol = cell.getColumnIndex();
				break;
			default:
				break;
			}
		}

		for (Row row : sheet) {
			if (firstRow) {
				firstRow = false;
				continue;
			}
			Repairer data = new Repairer();
			data.setUsername(getCellValueAsString(row.getCell(0)));
			data.setFirstName(getCellValueAsString(row.getCell(1)));
			data.setLastName(getCellValueAsString(row.getCell(2)));

			Cell genderCell = row.getCell(3);
			if (genderCell != null) {
				String gender = getCellValueAsString(genderCell);
				data.setGender("Homme".equalsIgnoreCase(gender));
			}

			data.setAddress(getCellValueAsString(row.getCell(4)));
			data.setPhone(getCellValueAsString(row.getCell(5)));
			data.setCity(getCellValueAsString(row.getCell(6)));
			data.setEmail(getCellValueAsString(row.getCell(7)));

			Cell passwordCell = row.getCell(8);
			if (passwordCell != null) {
				String password = getCellValueAsString(passwordCell);
				data.setPassword(passwordEncoder.encode(password));
			}

			data.setCin(getCellValueAsString(row.getCell(9)));
			data.setRib(getCellValueAsString(row.getCell(10)));

			if (isUnique(data) && !checkAvailableCin(data.getCin()) && !checkAvailableRib(data.getRib())
					&& !checkAvailable(data.getUsername(), data.getEmail())) {
				data.setActive(true);
				data.setEmailVerified(true);
				data.setRole(Role.REPAIRER);
				dataList.add(data);
				existingUsernames.add(data.getUsername());
				existingCins.add(data.getCin());
				existingEmails.add(data.getEmail());
				existingRibs.add(data.getRib());

			}
		}
		return dataList;
	}

	private boolean isUnique(Repairer data) {
		return !existingUsernames.contains(data.getUsername()) && !existingCins.contains(data.getCin())
				&& !existingEmails.contains(data.getEmail()) && !existingRibs.contains(data.getRib());
	}

	public void saveAllUplaod(MultipartFile file) {
		try {
			List<Repairer> dataList = parseExcelFile(file);
			repairerRepo.saveAll(dataList);
		} catch (IOException e) {
			throw new MasterException("Failed to store excel data: " + e.getMessage(), HttpStatus.FOUND);
		}
	}

	private String getCellValueAsString(Cell cell) {
		if (cell == null) {
			return null;
		}
		switch (cell.getCellType()) {
		case STRING:
			return cell.getStringCellValue();
		case NUMERIC:
			if (DateUtil.isCellDateFormatted(cell)) {
				return cell.getDateCellValue().toString();
			} else {
				return String.valueOf((int) cell.getNumericCellValue());
			}
		case BOOLEAN:
			return String.valueOf(cell.getBooleanCellValue());
		case FORMULA:
			return cell.getCellFormula();
		case BLANK:
			return "";
		default:
			return "";
		}
	}

	public boolean checkAvailable(String username, String email) {

		if (username != "") {
			Optional<User> user = userRepository.findByUsername(username);
			return user.isPresent();
		} else {
			Optional<User> user = userRepository.findByEmail(email);
			return user.isPresent();
		}
	}

	public Long countSuccessTrueByRepairerUsername(String username) {
		return reservationRepo.countBySuccessTrueAndRepairerUsername(username);
	}

	public Long countSuccessFalseByRepairerUsername(String username) {
		return reservationRepo.countBySuccessFalseAndRepairerUsername(username);
	}

	public Long countRepairerUsername(String username) {
		return reservationRepo.countByRepairerUsername(username);
	}

	public List<RepairerDto> getTopRepairers() {

		return repairerRepo.findTopRapairers().stream().map(this::mapToRepairerDto).collect(Collectors.toList());

	}

	public void addToFav(String client, Long repairer) {
		RepairerFavoris repairerFavoris = new RepairerFavoris();
		Repairer repairer2 = repairerRepo.findById(repairer).get();
		Client client2 = clientRepo.findByUsername(client).get();
		repairerFavoris.setRepairer(repairer2);
		repairerFavoris.setClient(client2);
		repairerFavorisRepo.save(repairerFavoris);

	}

	public void deleteFromFav(String client, Long repairer) {
		RepairerFavoris repairerFavoris = repairerFavorisRepo.findByClientUsernameAndRepairerId(client, repairer).get();
		repairerFavorisRepo.delete(repairerFavoris);
	}

	public List<RepairerDto> listFav(String client) {
		return repairerFavorisRepo.findAllByClientUsername(client).stream()
				.sorted(Comparator.comparingLong(RepairerFavoris::getId).reversed()).map(this::mapFavorisToRepairerDto)
				.collect(Collectors.toList());

	}

	public boolean isFav(String client, Long repairer) {
		Optional<RepairerFavoris> repairerFav = repairerFavorisRepo.findByClientUsernameAndRepairerId(client, repairer);
		if (repairerFav.isPresent()) {
			return true;
		} else {
			return false;
		}
	}

	public Repairer convertToRepairer(Repairer existingRepairer, RepairerDto repairerDto) {
		if (existingRepairer == null) {
			existingRepairer = new Repairer();
		}

		existingRepairer.setId(repairerDto.getId());
		existingRepairer.setUsername(repairerDto.getUsername());
		existingRepairer.setFirstName(repairerDto.getFirstName());
		existingRepairer.setLastName(repairerDto.getLastName());
		existingRepairer.setGender(repairerDto.isGender());
		existingRepairer.setAddress(repairerDto.getAddress());
		existingRepairer.setCity(repairerDto.getCity());
		existingRepairer.setEmail(repairerDto.getEmail());
		existingRepairer.setProfilePic(repairerDto.getProfilePic());
		existingRepairer.setEmailVerified(repairerDto.isEmailVerified());
		existingRepairer.setActive(repairerDto.isActive());
		existingRepairer.setRole(repairerDto.getRole());
		existingRepairer.setPhone(repairerDto.getPhone());
		existingRepairer.setCin(repairerDto.getCin());
		existingRepairer.setRib(repairerDto.getRib());
		existingRepairer.setImageProfile(repairerDto.getImageProfile());
		existingRepairer.setDescription(repairerDto.getDescription());
		existingRepairer.setPro(repairerDto.isPro());
		existingRepairer.setReviews(repairerDto.getReviews());

		if (repairerDto.getPassword() != null && !repairerDto.getPassword().isEmpty()) {
			existingRepairer.setPassword(repairerDto.getPassword());
		}

		return existingRepairer;
	}

}
