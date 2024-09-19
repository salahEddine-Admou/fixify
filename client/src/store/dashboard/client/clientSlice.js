import { createSlice } from '@reduxjs/toolkit';
import { getAll, toggleActivation } from './clientAction';


const initialState = {
    loading: false,
    error: null,
    success: false,
    clients: []
};

const clientSlice = createSlice({
    name: 'client',
    initialState,
    reducers: {

    },
    extraReducers: {
        [getAll.pending]: (state) => {
            state.loading = true;
        },
        [getAll.fulfilled]: (state, action) => {
            state.loading = false;
            state.error = null;
            state.success = true;
            state.clients = action.payload
        },
        [getAll.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.payload.error;
        },
        [toggleActivation.fulfilled]: (state, action) => {
            state.loading = false;
            state.error = null;
            state.success = true;
            const index = state.clients.findIndex(client => client.id === action.payload.id);
            if (index !== -1) {
                state.clients[index].active = action.payload.active;
            }
        },

    }
})

export default clientSlice.reducer;

// export const { setCredentials, clearErrors } = authSlice.actions;