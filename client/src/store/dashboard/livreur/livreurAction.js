import LivreurApi from '../../../api/LlivreurApi';
import { createAsyncThunk } from '@reduxjs/toolkit';


export const fetchReservationsByLivreur = createAsyncThunk(
    'livreur/fetchReservationsByLivreur',
    async (username, { rejectWithValue }) => {
        try {
            const response = await LivreurApi.getReservationsByLivreur(username);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response ? error.response.data : error.message);
        }
    }
);

export const toggleActivation = createAsyncThunk('delivery/toggleActivation', async ({ mode, id }, { rejectWithValue }) => {
    try {
        if (mode) {
            await LivreurApi.activateDelivery(id);
            console.log("activating");
            return { id, active: 1 };
        } else {
            await LivreurApi.desactivateDelivery(id);
            return { id, active: 0 };
        }
    } catch (error) {
        console.log("error", error.response.data);
        return rejectWithValue({
            error: error.response.data ? error.response.data : error
        });
    }
});

export const addDeliveryRetour = createAsyncThunk(
    'livreur/addDeliveryRetour',
    async ({ reservationId, usernameLivreur }, { rejectWithValue }) => {
        try {
            const response = await LivreurApi.addDeliveryRetour(reservationId, usernameLivreur);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response ? error.response.data : error.message);
        }
    }
);


