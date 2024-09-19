import { createAsyncThunk } from '@reduxjs/toolkit';
import SubCategoryApi from '../../../api/subCategoryApi';
import { errorToast, successToast } from '../../../utils';

export const getAllSubCategories = createAsyncThunk(
  'subCategory/getAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await SubCategoryApi.getAll();
      console.log("SubCategories response", response.data);
      return response.data;
    } catch (error) {
      console.log("error", error.response.data);
      return rejectWithValue({
        error: error.response.data ? error.response.data : error
      });
    }
  }
);

export const createSubCategory = createAsyncThunk(
  'subCategory/create',
  async (subCategoryData, { rejectWithValue }) => {
    try {
      const response = await SubCategoryApi.createSubCategory(subCategoryData);
      successToast("La marque ajoutée");
      return response.data;
    } catch (error) {
      console.log("Error adding subCategory:", error.response.data);
      return rejectWithValue({
        error: error.response.data ? error.response.data : error
      });
    }
  }
);

export const deleteSubCategory = createAsyncThunk(
  'subCategory/delete',
  async (id, { rejectWithValue }) => {
    try {
      const response = await SubCategoryApi.deleteSubCategory(id);
      successToast("La marque supprimée ");
      return id;
    } catch (error) {
      alert(error.response.data);
      console.log("Error deleting subCategory:", error.response);
      return rejectWithValue({
        error: error.response.data ? error.response.data : error
      });
    }
  }
);

export const getAllCategoriesModels = createAsyncThunk(
    'subCategory/getAllCategoriesModels',
    async (_, { rejectWithValue }) => {
      try {
        const response = await SubCategoryApi.getAllCategories();
        console.log("Categories response", response.data);
        return response.data;
      } catch (error) {
        console.log("error", error.response.data);
        return rejectWithValue({
          error: error.response.data ? error.response.data : error
        });
      }
    }
  );

export const updateSubCategory = createAsyncThunk(
    'subCategory/update',
    async ({ id, subCategoryData }, { rejectWithValue }) => {
      try {
        const response = await SubCategoryApi.updateSubCategory(id, subCategoryData);
        successToast("La marque modifiée");
        return response.data;
      } catch (error) {
        console.log("Error updating subcategory:", error.response);
        return rejectWithValue({
          error: error.response.data ? error.response.data : error
        });
      }
    }
  );

export const getSubCategoryById = createAsyncThunk(
    'subCategory/getById',
    async (id, { rejectWithValue }) => {
      try {
        const response = await SubCategoryApi.getOne(id);
        console.log(response.data);
        return response.data;
      } catch (error) {
        console.log("Error fetching subcategory by ID:", error.response.data);
        return rejectWithValue({
          error: error.response.data ? error.response.data : error
        });
      }
    }
);
export const getSubCategoriesByCategory = createAsyncThunk(
  'subCategory/getByCategory',
  async (category, { rejectWithValue }) => {
    try {
      const response = await SubCategoryApi.getByCategory(category);
      return response.data;
    } catch (error) {
      return rejectWithValue({
        error: error.response.data ? error.response.data : error
      });
    }
  }
);