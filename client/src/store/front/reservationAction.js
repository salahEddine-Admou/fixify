import { createAsyncThunk } from '@reduxjs/toolkit';
import ReservationApi from '../../api/ReservationApi'

export const getAll = createAsyncThunk(
    'reservation/getAll',
    async ({ username, role }, { rejectWithValue }) => {
        try {


            let response = []
            if (role == "repairer")
                response = await ReservationApi.getRepairerReservations(username)
            else if (role == "client")
                response = await ReservationApi.getClientReservations(username)
            else
                response = await ReservationApi.getAll()
            return response.data;
        } catch (error) {
            return rejectWithValue({
                error: error.response.data ? error.response.data : error
            });
        }
    }
);
export const togglePaid = createAsyncThunk(
    'reservation/togglePaid',
    async ({ reservId, id, mode }, { rejectWithValue }) => {
        try {
            if (mode)
                await ReservationApi.makePaid(id)
            else
                await ReservationApi.makeUnpaid(id)
            return { reservId, id, mode };
        } catch (error) {
            return rejectWithValue({
                error: error.response.data ? error.response.data : error
            });
        }
    }
);
export const makeSuccess = createAsyncThunk(
    'reservation/makeSuccess',
    async (id, { rejectWithValue }) => {
        try {

            await ReservationApi.makeSuccess(id)
            return id;
        } catch (error) {
            return rejectWithValue({
                error: error.response.data ? error.response.data : error
            });
        }
    }
);
export const notResolved = createAsyncThunk(
    'reservation/notReslved',
    async (id, { rejectWithValue }) => {
        try {

            await ReservationApi.nonResolved(id)
            return id;
        } catch (error) {
            return rejectWithValue({
                error: error.response.data ? error.response.data : error
            });
        }
    }
);


