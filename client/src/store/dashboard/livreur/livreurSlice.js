import { createSlice } from '@reduxjs/toolkit';
import { fetchReservationsByLivreur,toggleActivation,addDeliveryRetour } from './livreurAction';

const initialState = {
    loading: false,
    error: null,
    success: false,
    reservations: []
};

const livreurSlice = createSlice({
    name: 'livreur',
    initialState,
    reducers: {},
    extraReducers: {
        [fetchReservationsByLivreur.pending]: (state) => {
            state.loading = true;
        },
        [fetchReservationsByLivreur.fulfilled]: (state, action) => {
            state.loading = false;
            state.error = null;
            state.success = true;
            state.reservations = action.payload;
        },
        [fetchReservationsByLivreur.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        [toggleActivation.fulfilled]: (state, action) => {
            state.loading = false;
            state.error = null;
            state.success = true;
        },
        [addDeliveryRetour.pending]: (state) => {
            state.loading = true;
        },
        [addDeliveryRetour.fulfilled]: (state, action) => {
            state.loading = false;
            state.error = null;
            state.success = true;
        },
        [addDeliveryRetour.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
       
    }
});

export default livreurSlice.reducer;
