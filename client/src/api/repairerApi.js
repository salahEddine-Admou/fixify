import AxiosClient from "./axiosClient";
import axios from "axios";

const RepairerApi = {
    getAll: () => AxiosClient.get("/api/Repairer"),
    getAllPro: () => AxiosClient.get("/api/Repairer/Pro"),
    getTopRepairers: () => AxiosClient.get("/api/Repairer/top"),
    activate: (id) => AxiosClient.put(`/api/admin/activate-repairer/${id}`),
    desactivate: (id) => AxiosClient.put(`/api/admin/desactivate-repairer/${id}`),
    SignUp: (repairerData) => AxiosClient.post("/api/Repairer/signup", repairerData),
    deleteRepairer: (id) => AxiosClient.delete(`/api/Repairer/${id}`),
    search: (searchData, page = 1, size = 1) => AxiosClient.post(`/api/Repairer/search-repairers?page=${page}&size=${size}`, searchData),
    getAllProblems: () => AxiosClient.get("/api/problem"),
    getModelsByProblemId: (problemId) => AxiosClient.get(`/api/model/problem/${problemId}`),
    assignProblems: (requestBody, repairerId) => AxiosClient.post(`/api/Repairer/${repairerId}/assign-problem`, requestBody),
    getReparations: (repairerId) => AxiosClient.get(`/api/Repairer/${repairerId}/reparations`),
    deleteReparationsByIdReparateur: (repairerId) => AxiosClient.delete(`/api/Repairer/delete/${repairerId}/reparations`),
    getByUsername: (username) => AxiosClient.get(`/api/Repairer/findOne/${username}`),
    getById: (id) => AxiosClient.get(`/api/Repairer/${id}`), // Nouvelle méthode getById
    updateRepairer: (id, repairerData) => AxiosClient.put(`/api/Repairer/${id}`, repairerData),
    enablePro: (repairerId) => AxiosClient.put(`/api/Repairer/${repairerId}/enablePro`),
    disablePro: (repairerId) => AxiosClient.put(`/api/Repairer/${repairerId}/disablePro`),
    addToFav: (repairerId, clientId) => AxiosClient.post(`/api/Repairer/add-fav/client/${clientId}/repairer/${repairerId}`),
    deleteFromFav: (repairerId, clientId) => AxiosClient.delete(`/api/Repairer/delete-fav/client/${clientId}/repairer/${repairerId}`),
    listFav: (clientId) => AxiosClient.get(`/api/Repairer/list-fav/client/${clientId}`),
    isFav: (repairerId, clientId) => AxiosClient.get(`/api/Repairer/is-fav/client/${clientId}/repairer/${repairerId}`),
    updateProStatus: async (repairerId, isPro) => {
        const url = `/repairer/${repairerId}/status`;
        const data = { isPro };
        return await axios.put(url, data);
    },
    getRepairerProfile: (id) => AxiosClient.get(`/api/Repairer/${id}/repairerProfil`), // Nouvelle méthode getRepairerProfile

    // Nouvelle méthode pour récupérer le nombre de réservations réussies pour un réparateur spécifique
    getSuccessfulReservationsCount: (repairerId) => AxiosClient.get(`/api/repairers/${repairerId}/successfulReservationsCount`),

    // Nouvelle méthode pour récupérer le total d'appareils pour un réparateur spécifique
    getTotalDevicesCount: (repairerId) => AxiosClient.get(`/api/repairers/${repairerId}/totalDevicesCount`),

    // Nouvelles méthodes pour récupérer les marques, modèles et problèmes spécifiques à un réparateur
    getMarquesByRepairerId: (repairerId) => AxiosClient.get(`/api/Repairer/${repairerId}/marques`),
    getModelesByRepairerId: (repairerId) => AxiosClient.get(`/api/Repairer/${repairerId}/modeles`),
    getProblemsByRepairerId: (repairerId) => AxiosClient.get(`/api/Repairer/${repairerId}/problems`),

    //Marquer disponibilité d'un repairer
    Dispo: (repairerId) => AxiosClient.put(`/api/Repairer/${repairerId}/Dispo`),
    NonDispo: (repairerId) => AxiosClient.put(`/api/Repairer/${repairerId}/NonDispo`),


    checkCin: (cin) => AxiosClient.post(`/api/Repairer/check-available-cin/${cin}`),
    checkRib: (rib) => AxiosClient.post(`/api/Repairer/check-available-rib/${rib}`),

    uploadExcelFile:(data)=>AxiosClient.post(`/api/Repairer/upload`,data),

    emailChangePassword: (id) => AxiosClient.post(`/api/auth/emailChangePassById/${id}`),
    changePassword: (id,password) => AxiosClient.post(`/api/auth/ChangePassword/${id}/${password}`),

    getStatsReservation: (username) => AxiosClient.get(`/api/Repairer/stats/${username}`),
    getTopClientByRepairer: (username) => AxiosClient.get(`/api/Repairer/top-clients/${username}`),
    getReservationByProblem:(username) => AxiosClient.get(`/api/Repairer/reservationsProblems/${username}`),
    getReservationByCategory:() => AxiosClient.get(`/api/admin/count-by-category`),

}

export default RepairerApi