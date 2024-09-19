import AxiosClient from "./axiosClient";

const categoryModelApi = {
    getAll: () => AxiosClient.get("/api/categorymodel"),
    getOne: (id) => AxiosClient.get(`/api/categorymodel/${id}`),
    updateCategoryModel: (id, categoryModelData) => AxiosClient.put(`/api/categorymodel/${id}`, categoryModelData),
    createCategoryModel: (categoryModelData) => AxiosClient.post("/api/categorymodel", categoryModelData),
    deleteCategoryModel: (id) => AxiosClient.delete(`/api/categorymodel/${id}`),
    checkName: (data) => AxiosClient.post('/api/categorymodel/check-available', data),
};

export default categoryModelApi;
