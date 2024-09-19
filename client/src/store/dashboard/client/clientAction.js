import { createAsyncThunk } from '@reduxjs/toolkit';
import ClientApi from '../../../api/clientApi';

export const getAll = createAsyncThunk('client/getAll', async (_, { rejectWithValue }) => {
    try {
        const response = await ClientApi.getAll()

        console.log("clients response", response.data);
        return await response.data;
    } catch (error) {
        console.log("error", error.response.data);
        return rejectWithValue({
            error: error.response.data ? error.response.data : error
        });
    }
});
export const toggleActivation = createAsyncThunk('client/toggleActivation', async ({ mode, id }, { rejectWithValue }) => {
    try {
        if (mode) {
            await ClientApi.activate(id)
            console.log("activating");
            return { id, active: 1 };
        } else {
            console.log("desactivating");
            await ClientApi.desactivate(id)
            return { id, active: 0 };
        }
    } catch (error) {
        console.log("error", error.response.data);
        return rejectWithValue({
            error: error.response.data ? error.response.data : error
        });
    }
});