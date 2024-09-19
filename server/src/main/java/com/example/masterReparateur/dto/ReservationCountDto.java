package com.example.masterReparateur.dto;

import java.time.LocalDate;
import java.time.YearMonth;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ReservationCountDto {

	private YearMonth month;
	private Long count;

}
