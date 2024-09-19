package com.example.masterReparateur.dto;

import javax.swing.plaf.nimbus.State;

import com.example.masterReparateur.models.Reservation;

import lombok.Data;

@Data
public class ClientReservationResponse extends ReservationResponse {
	private String trackStatus;

	public ClientReservationResponse(Reservation reservation) {
		super(reservation);

	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (!super.equals(obj))
			return false;
		if (getClass() != obj.getClass())
			return false;
		ClientReservationResponse other = (ClientReservationResponse) obj;
		if (trackStatus == null) {
			if (other.trackStatus != null)
				return false;
		} else if (!trackStatus.equals(other.trackStatus))
			return false;
		return true;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = super.hashCode();
		result = prime * result + ((trackStatus == null) ? 0 : trackStatus.hashCode());
		return result;
	}

}
