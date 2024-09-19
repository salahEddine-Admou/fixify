import { createSlice } from '@reduxjs/toolkit';
import { getAllCategoriesModel, createCategoryModel, deleteCategoryModel, updateCategoryModel } from './CategoryModelAction';

const initialState = {
    loading: false,
    error: null,
    success: false,
    categories: [],
    category: {
        id: null,
        name: null,
        description: null
    },
};

const categoryModelSlice = createSlice({
    name: 'categoryModel',
    initialState,
    reducers: {},
    extraReducers: {
        [getAllCategoriesModel.pending]: (state) => {
            state.loading = true;
        },
        [getAllCategoriesModel.fulfilled]: (state, action) => {
            state.loading = false;
            state.error = null;
            state.categories = action.payload;
        },
        [getAllCategoriesModel.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.payload.error;
        },
        [createCategoryModel.fulfilled]: (state, action) => {
            state.loading = false;
            state.error = null;
            state.success = true;
            state.categories.push(action.payload);
        },
        [createCategoryModel.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.payload.error;
        },
        [deleteCategoryModel.fulfilled]: (state, action) => {
            state.loading = false;
            state.error = null;
            state.success = true;
            state.categories = state.categories.filter(category => category.id !== action.payload);
        },
        [updateCategoryModel.fulfilled]: (state, action) => {
            state.loading = false;
            state.error = null;
            state.success = true;
            state.categories = state.categories.map(category =>
                category.id === action.payload.id ? action.payload : category
            );
        },
        [updateCategoryModel.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.payload.error
        },
    }
});

export default categoryModelSlice.reducer;
