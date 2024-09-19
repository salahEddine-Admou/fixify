import AxiosClient from "./axiosClient";

const blogApi = {
    getAll: () => AxiosClient.get("/api/blogs"),
    getOne: (id) => AxiosClient.get(`/api/blogs/${id}`),
    updateBlog: (id, blogData) => AxiosClient.put(`/api/blogs/${id}`, blogData),
    createBlog: (blogData) => AxiosClient.post("/api/blogs", blogData),
    deleteBlog: (id) => AxiosClient.delete(`/api/blogs/${id}`)
};

export default blogApi;