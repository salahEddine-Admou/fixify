import { createAsyncThunk } from '@reduxjs/toolkit';
import ClientApi from '../../../api/clientApi';
import ProblemTypeApi from '../../../api/ProblemTypeApi';
import { successToast } from '../../../utils';

export const getAll = createAsyncThunk('problem/getAll', async (_, { rejectWithValue }) => {
    try {
        const response = await ProblemTypeApi.getAll()
        const filteredData = response.data.filter(deviceType => deviceType.name.toLowerCase() !== 'autre');
        return filteredData;
    } catch (error) {
        console.log("error", error.response.data);
        return rejectWithValue({
            error: error.response.data ? error.response.data : error
        });
    }
});

export const create = createAsyncThunk('problem/create', async (problem, { rejectWithValue }) => {
    try {
        const response = await ProblemTypeApi.create(problem)

        return await response.data;
    } catch (error) {
        console.log("error", error.response.data);
        return rejectWithValue({
            error: error.response.data ? error.response.data : error
        });
    }
});

export const update = createAsyncThunk('problem/update', async ({ problem, id }, { rejectWithValue }) => {
    try {
        const response = await ProblemTypeApi.update(problem, id)

        return await response.data;
    } catch (error) {
        console.log("error", error.response.data);
        return rejectWithValue({
            error: error.response.data ? error.response.data : error
        });
    }
});
/*export const remove = createAsyncThunk('problem/remove', async (id, { rejectWithValue }) => {
    try {
        await ProblemTypeApi.delete(id)
        return id;
    } catch (error) {
        console.log("error", error.response.data);
        return rejectWithValue({
            error: error.response.data ? error.response.data : error
        });
    }
});*/

export const remove = createAsyncThunk(
    'problem/remove',
    async (id, { rejectWithValue }) => {
      try {
        const response = await ProblemTypeApi.delete(id);
        successToast("La marque supprimée ");
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