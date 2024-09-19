import { createSlice } from '@reduxjs/toolkit';
import { getAll, makeSuccess, notResolved, togglePaid } from './reservationAction';

let reservInfos = localStorage.getItem("reservInfos");
reservInfos = JSON.parse(reservInfos) ? JSON.parse(reservInfos) : null;

const initialState = {
    loading: false,
    error: null,
    success: false,
    infos: reservInfos,
    reservations: []
};

const ReservationSlice = createSlice({
    name: 'reservation',
    initialState,
    reducers: {
        setInfos: (state, action) => {
            state.infos = action.payload;
            localStorage.setItem('reservInfos', JSON.stringify(action.payload));
        },
    },
    extraReducers: {
        [getAll.pending]: (state) => {
            state.loading = true;
        },
        [getAll.fulfilled]: (state, action) => {
            state.loading = false;
            state.error = null;
            state.success = true;
            state.reservations = action.payload
        },
        [getAll.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.payload.error;
        },
        [makeSuccess.fulfilled]: (state, action) => {
            state.loading = false;

            state.error = null;
            state.success = true;
            const index = state.reservations.findIndex(reservation => reservation.id === action.payload);
            if (index !== -1) {
                state.reservations[index].success = 1;
            }

        },
        [notResolved.fulfilled]: (state, action) => {

            state.loading = false;
            state.error = null;
            state.success = true;
            const index = state.reservations.findIndex(reservation => reservation.id === action.payload);
            if (index !== -1) {
                state.reservations[index].resolvable = 0;
            }
        },

        [togglePaid.fulfilled]: (state, action) => {
            state.loading = false;

            state.error = null;
            state.success = true;

            const resIndex = state.reservations.findIndex(res => res.id === action.payload.reservId);
            if (resIndex !== -1) {
                let reserv = state.reservations[resIndex]
                console.log("found reservation", reserv, resIndex);


                state.reservations[resIndex].invoices[0].paid = action.payload.mode;

            }





        }

    }
});

export const { setInfos } = ReservationSlice.actions;
export default ReservationSlice.reducer;