package com.example.masterReparateur.dto;

import java.util.ArrayList;
import java.util.List;

import lombok.Data;

@Data
public class DashboardDto {
	private List<ReservationCountDto> reservationsCount = new ArrayList<>();
}
