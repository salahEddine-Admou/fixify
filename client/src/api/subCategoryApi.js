import AxiosClient from "./axiosClient";

const SubCategoryApi = {
    getAll: () => AxiosClient.get("/api/subcategorymodel"),
    getOne: (id) => AxiosClient.get(`/api/subcategorymodel/${id}`),
    updateSubCategory: (id, subCategoryData) => AxiosClient.put(`/api/subcategorymodel/${id}`, subCategoryData),
    createSubCategory: (subCategoryData) => AxiosClient.post("/api/subcategorymodel", subCategoryData),
    deleteSubCategory: (id) => AxiosClient.delete(`/api/subcategorymodel/${id}`),
    getAllCategories: () => AxiosClient.get("/api/categorymodel"),
    getByCategory: (category) => AxiosClient.get(`/api/subcategorymodel?category=${category}`),
    checkName: (id,data) => AxiosClient.post(`/api/subcategorymodel/check-available/${id}`, data),
}

export default SubCategoryApi;