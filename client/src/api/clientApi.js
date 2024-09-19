import AxiosClient from "./axiosClient";

const ClientApi = {
    getAll: () => AxiosClient.get("/api/admin/clients"),
    activate: (id) => AxiosClient.put(`/api/admin/activate-client/${id}`),
    desactivate: (id) => AxiosClient.put(`/api/admin/desactivate-client/${id}`),
}
export default ClientApi