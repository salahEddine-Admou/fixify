import { deleteModel, getPrices } from "../store/dashboard/model/ModelAction";
import AxiosClient from "./axiosClient";

const ModelApi = {
    getAll: () => AxiosClient.get("/api/model"),
    add: (model) => AxiosClient.post("/api/model", model),
    update: (id, Model) => AxiosClient.put(`/api/model/${id}`, Model),
    delete: (id) => AxiosClient.delete(`/api/model/${id}`),
    getPrices: (modelId, user) => AxiosClient.get(`/api/model/${modelId}/repairer/${user}/prices`),
    checkName: (data) => AxiosClient.post(`/api/model/check-available`, data),

};

export default ModelApi;
