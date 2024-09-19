import { createAsyncThunk } from '@reduxjs/toolkit';
import blogApi from '../../api/BlogApi';

export const fetchBlogs = createAsyncThunk('blogs/fetchBlogs', async () => {
  const response = await blogApi.getAll();
  return response.data;
});

export const createNewBlog = createAsyncThunk('blogs/createNewBlog', async (blogData) => {
  const response = await blogApi.createBlog(blogData);
  return response.data;
});

export const updateExistingBlog = createAsyncThunk('blogs/updateExistingBlog', async ({ id, blogData }) => {
  const response = await blogApi.updateBlog(id, blogData);
  return response.data;
});

export const deleteExistingBlog = createAsyncThunk('blogs/deleteExistingBlog', async (id) => {
  await blogApi.deleteBlog(id);
  return id;
});
