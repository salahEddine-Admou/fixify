import { createSlice } from '@reduxjs/toolkit';
import { createAsyncThunk } from '@reduxjs/toolkit';
import categoryModelApi from '../../../api/categoryModelApi';
import { successToast,errorToast } from '../../../utils';

export const getAllCategoriesModel = createAsyncThunk(
    'category/getAll',
    async (_, { rejectWithValue }) => {
        try {
            const response= await categoryModelApi.getAll();
            const filteredData = response.data.filter(deviceType => deviceType.name.toLowerCase() !== 'autre');
            return filteredData;
        } catch (error) {
            return rejectWithValue({
                error: error.response.data ? error.response.data : error
            });
        }
    }
);

export const createCategoryModel = createAsyncThunk(
    'category/create',
    async (categoryModelData, { rejectWithValue }) => {
        try {
            const response = await categoryModelApi.createCategoryModel(categoryModelData);
            successToast("Le modèle de catégorie a été ajouté avec succès.");
            return response.data;
        } catch (error) {
            console.log("Error adding category model:", error.response.data);
            return rejectWithValue({
                error: error.response.data ? error.response.data : error
            });
        }
    }
);

export const deleteCategoryModel = createAsyncThunk(
    'category/delete',
    async (id, { rejectWithValue }) => {
        try {
            const response = await categoryModelApi.deleteCategoryModel(id);
            successToast("Le modèle de catégorie a été supprimé avec succès.");
            return id;
        } catch (error) {
            alert(error.response.data);
            return rejectWithValue({
                error: error.response.data
            });
        }
    }
);

export const updateCategoryModel = createAsyncThunk(
    'category/update',
    async ({ id, categoryModelData }, { rejectWithValue }) => {
        try {
            const response = await categoryModelApi.updateCategoryModel(id, categoryModelData);
            successToast("Le modèle de catégorie a été mis à jour avec succès.");
            return response.data;
        } catch (error) {
            console.log("Error updating category model:", error.response.data);
            return rejectWithValue({
                error: error.response.data ? error.response.data : error
            });
        }
    }
);

