
import { createSlice } from '@reduxjs/toolkit';
import { createModel, getAllModel, getPrices, updateModel, deleteModel, getAllModelsByCategory, getAllModelsByBrand } from './ModelAction';

const initialState = {
    loading: false,
    error: null,
    success: false,
    models: [],
    prices: [],
};

const ModelSlice = createSlice({
    name: 'model',
    initialState,
    reducers: {},
    extraReducers: {
        [getAllModel.pending]: (state) => {
            state.loading = true;
        },
        [getAllModel.fulfilled]: (state, action) => {
            state.loading = false;
            state.error = null;
            state.models = action.payload;
        },
        [getAllModel.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.payload.error;
        },

        [createModel.pending]: (state) => {
            state.loading = true;
        },
        [createModel.fulfilled]: (state, action) => {
            state.loading = false;
            state.error = null;
            state.models = [action.payload, ...state.models];
        },
        [createModel.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.payload.error;
        },

        [updateModel.pending]: (state) => {
            state.loading = true;
        },
        [updateModel.fulfilled]: (state, action) => {

            state.loading = false;
            state.error = null;
            state.success = true;
            state.models = state.models.map(modele => {
                if (modele.id === action.payload.id) {
                    return action.payload; 
                }
                return modele; 
            });
        },
        [updateModel.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.payload.error;
        },
        [deleteModel.fulfilled]: (state, action) => {
            state.loading = false;
            state.error = null;
            state.success = true;
            state.models = state.models.filter(modele => modele.id !== action.payload);
        },

        [getPrices.fulfilled]: (state, action) => {
            state.loading = false;
            state.error = null;
            state.prices = action.payload;
        }   
    }
});

export default ModelSlice.reducer;

