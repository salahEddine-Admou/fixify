import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import categoryModelApi from "../../../api/categoryModelApi";
import { errorToast, successToast } from "../../../utils";
import ModelApi from "../../../api/ModelAPI";
import SubCategoryApi from "../../../api/subCategoryApi";

export const getAllModel = createAsyncThunk(
  "Model/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await ModelApi.getAll();
      return response.data;
    } catch (error) {
      return rejectWithValue({
        error: error.response.data ? error.response.data : error,
      });
    }
  }
);
export const createModel = createAsyncThunk(
  "model/create",
  async (modelData, { rejectWithValue }) => {
    try {
      const response = await ModelApi.add(modelData);
      return response.data;
    } catch (error) {
      return rejectWithValue({
        error: error.response ? error.response.data : error.message,
      });
    }
  }
);

export const updateModel = createAsyncThunk(
  'model/update',
  async ({ id, Model }, { rejectWithValue }) => {
    try {
      const response = await ModelApi.update(id, Model);
      successToast("Le modèle a été mis à jour avec succès.");
      return response.data;
    } catch (error) {
      console.log("Error updating Model:", error.response.data);
      return rejectWithValue({
        error: error.response.data ? error.response.data : error
      });
    }
  }
);



export const deleteModel = createAsyncThunk(
  'model/delete',
  async (id, { rejectWithValue }) => {
    try {
      const response = await ModelApi.delete(id);
      successToast("Le model supprimée ");
      return id;
    } catch (error) {
      alert(error.response.data);
      console.log("Error deleting model:", error.response.data);
      return rejectWithValue({
        error: error.response.data ? error.response.data : error
      });
    }
  }
);

export const getPrices = createAsyncThunk(
  'Model/getPrices',
  async ({ modelId, user }, { rejectWithValue }) => {
    try {
      const response = await ModelApi.getPrices(modelId, user);
      return response.data;
    } catch (error) {
      return rejectWithValue({
        error: error.response.data ? error.response.data : error
      });
    }
  }
);






