import { createSlice } from '@reduxjs/toolkit';
import { createTestimonial, getAllTestimonials, updateTestimonial, deleteTestimonial } from './testimonialAction';

const initialState = {
    loading: false,
    error: null,
    success: false,
    testimonials: [],
};

const testimonialSlice = createSlice({
    name: 'testimonials',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllTestimonials.pending, (state) => {
                state.loading = true;
            })
            .addCase(getAllTestimonials.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.testimonials = action.payload;
            })
            .addCase(getAllTestimonials.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.error;
            })
            .addCase(createTestimonial.pending, (state) => {
                state.loading = true;
            })
            .addCase(createTestimonial.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.testimonials = [action.payload, ...state.testimonials];
            })
            .addCase(createTestimonial.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.error;
            })
            .addCase(updateTestimonial.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateTestimonial.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.success = true;
                state.testimonials = state.testimonials.map(testimonial =>
                    testimonial.id === action.payload.id ? action.payload : testimonial
                );
            })
            .addCase(updateTestimonial.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.error;
            })
            .addCase(deleteTestimonial.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.success = true;
                state.testimonials = state.testimonials.filter(testimonial => testimonial.id !== action.payload);
            });
    }
});

export default testimonialSlice.reducer;
