import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import testimonialApi from '../../api/testimonialApi';

// Thunks pour les opérations asynchrones
export const getAllTestimonials = createAsyncThunk(
    'testimonials/getAll',
    async (_, { rejectWithValue }) => {
        try {
            const response = await testimonialApi.getAll();
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const createTestimonial = createAsyncThunk(
    'testimonials/create',
    async (testimonialData, { rejectWithValue }) => {
        try {
            const response = await testimonialApi.create(testimonialData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const updateTestimonial = createAsyncThunk(
    'testimonials/update',
    async ({ id, testimonialData }, { rejectWithValue }) => {
        try {
            const response = await testimonialApi.update(id, testimonialData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const deleteTestimonial = createAsyncThunk(
    'testimonials/delete',
    async (id, { rejectWithValue }) => {
        try {
            await testimonialApi.delete(id);
            return id;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

