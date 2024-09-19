import AxiosClient from "./axiosClient";

const ProblemTypeApi = {
    getAll: () => AxiosClient.get("/api/problem"),
    create: (problem) => AxiosClient.post(`/api/problem`, problem),
    getAllCategories: () => AxiosClient.get("/api/categorymodel"),
    update: (problem, id) => AxiosClient.put(`/api/problem/${id}`, problem),
    getByModel: (id) => AxiosClient.get(`/api/problem/model/${id}`),
    createPrices: (prices, modelId, user) => AxiosClient.post(`/api/problem/create-prices/model/${modelId}/repairer/${user}`, prices),
    delete: (id) => AxiosClient.delete(`/api/problem/${id}`),
    getTotal: (modelId, problemId, repairer) => AxiosClient.get(`api/problem/price/model/${modelId}/problem/${problemId}/repairer/${repairer}`),
    checkName: (id, data) => AxiosClient.post(`/api/problem/check-available/${id}`, data),
}
export default ProblemTypeApi              