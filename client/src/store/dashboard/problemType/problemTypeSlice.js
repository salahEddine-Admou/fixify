import { createSlice } from '@reduxjs/toolkit';
import { create, getAll, remove, update } from './problemTypeAction';



const initialState = {
    loading: false,
    error: null,
    success: false,
    problems: []
};

const problemTypeSlice = createSlice({
    name: 'problem',
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
            state.problems = action.payload
        },
        [getAll.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.payload.error;
        },
        [create.pending]: (state) => {
            state.loading = true;
        },
        [create.fulfilled]: (state, action) => {

            state.loading = false;
            state.error = null;
            state.success = true;
            state.problems = [action.payload, ...state.problems];
        },
        [create.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.payload.error;
        },
        [update.pending]: (state) => {
            state.loading = true;
        },
        [update.fulfilled]: (state, action) => {

            state.loading = false;
            state.error = null;
            state.success = true;
            state.problems = state.problems.map(problem => {
                if (problem.id === action.payload.id) {
                    return action.payload; // Replace the item with the updated item
                }
                return problem; // Return the original item if the IDs don't match
            });
        },
        [update.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.payload.error;
        },
        [remove.fulfilled]: (state, action) => {
            state.loading = false;
            state.error = null;
            state.success = true;
            state.problems = state.problems.filter(problem => problem.id !== action.payload);
        },


    }
})

export default problemTypeSlice.reducer;

