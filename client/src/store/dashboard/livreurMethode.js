import { createAsyncThunk } from '@reduxjs/toolkit';
import LivreurApi from '../../../api/livreurApi';

export const getAll = createAsyncThunk('livreur/getAll', async (_, { rejectWithValue }) => {
    try {
        const response = await LivreurApi.getAll()

        console.log("livreurs response", response.data);
        return await response.data;
    } catch (error) {
        console.log("error", error.response.data);
        return rejectWithValue({
            error: error.response.data ? error.response.data : error
        });
    }
});
export const toggleActivation = createAsyncThunk('livreur/toggleActivation', async ({ mode, id }, { rejectWithValue }) => {
    try {
        if (mode) {
            await LivreurApi.activate(id)
            console.log("activating");
            return { id, active: 1 };
        } else {
            console.log("desactivating");
            await LivreurApi.desactivate(id)
            return { id, active: 0 };
        }
    } catch (error) {
        console.log("error", error.response.data);
        return rejectWithValue({
            error: error.response.data ? error.response.data : error
        });
    }
});