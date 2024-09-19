import { createSlice } from '@reduxjs/toolkit';
import { fetchBlogs, createNewBlog, updateExistingBlog, deleteExistingBlog } from '../blogpage/blogAction';

const initialState = {
  blogs: [],
  loading: false,
  error: null,
};

const blogSlice = createSlice({
  name: 'blogs',
  initialState,
  reducers: {
    // Les reducers supplémentaires peuvent être ajoutés ici si nécessaire
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlogs.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        state.loading = false;
        state.blogs = action.payload;
        state.error = null;
      })
      .addCase(fetchBlogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createNewBlog.fulfilled, (state, action) => {
        state.blogs.push(action.payload);
      })
      .addCase(updateExistingBlog.fulfilled, (state, action) => {
        const index = state.blogs.findIndex((blog) => blog.id === action.payload.id);
        if (index !== -1) {
          state.blogs[index] = action.payload;
        }
      })
      .addCase(deleteExistingBlog.fulfilled, (state, action) => {
        state.blogs = state.blogs.filter((blog) => blog.id !== action.payload);
      });
  },
});

export default blogSlice.reducer;
