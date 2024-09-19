import { createSlice } from '@reduxjs/toolkit';
import { getAllSubCategories, createSubCategory, deleteSubCategory, getAllCategoriesModels,getSubCategoryById,updateSubCategory ,getSubCategoriesByCategory} from './subCategoryAction';

const initialState = {
  loading: false,
  error: null,
  success: false,
  subCategories: [],
};

const subCategorySlice = createSlice({
  name: 'subCategory',
  initialState,
  reducers: {},
  extraReducers: {
    [getAllSubCategories.pending]: (state) => {
      state.loading = true;
    },
    [getAllSubCategories.fulfilled]: (state, action) => {
      state.loading = false;
      state.error = null;
      state.success = true;
      state.subCategories = action.payload;
    },
    [getAllSubCategories.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload.error;
    },
    [createSubCategory.fulfilled]: (state, action) => {
      state.loading = false;
      state.error = null;
      state.success = true;
      state.subCategories.push(action.payload);
    },
    [createSubCategory.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload.error;
    },
    [deleteSubCategory.fulfilled]: (state, action) => {
      state.loading = false;
      state.error = null;
      state.success = true;
      state.subCategories = state.subCategories.filter(subCategory => subCategory.id !== action.payload);
    },
    [getSubCategoryById.pending]: (state) => {
      state.loading = true;
    },
    [getSubCategoryById.fulfilled]: (state, action) => {
      state.loading = false;
      state.error = null;
      state.subCategory = action.payload;
    },
    [getSubCategoryById.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload.error;
    },[updateSubCategory.pending]: (state) => {
      state.loading = true;
    },
    [updateSubCategory.fulfilled]: (state, action) => {
      state.loading = false;
      state.error = null;
      state.success = true;
      state.subCategories = state.subCategories.map(subCategory =>
        subCategory.id === action.payload.id ? action.payload : subCategory
      );
    },
    [updateSubCategory.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload.error;
    },
    [getSubCategoriesByCategory.fulfilled]: (state, action) => {
      state.loading = false;
      state.error = null;
      state.subCategories = action.payload;
    },
    [getSubCategoriesByCategory.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload.error;
    },
  }
});

export default subCategorySlice.reducer;