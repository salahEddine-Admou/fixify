import AxiosClient from './axiosClient';

const ReservationApi = {
    getAll: () => AxiosClient.get("/api/reservation"),
    getAllReservationProblemOther: () => AxiosClient.get("/api/reservation/ReservationsWithNullReparationDetails"),
    create: (reservation) => AxiosClient.post("/api/reservation/create", reservation),
    createReservationProblemOther: (reservation) => AxiosClient.post("/api/reservation/createReservationForProblemOther", reservation),
    getNewReservations: () => AxiosClient.get("/api/reservation/new"),
    getNewSingleReservation: (id) => AxiosClient.get(`/api/reservation/new/${id}`),
    getNewSingleRequest: (id) => AxiosClient.get(`/api/request/new/${id}`),
    acceptReservation: (username, reservationId, type) => AxiosClient.post(`/api/livreur/${username}/accept/${reservationId}/type/${type}`),
    getRepairerReservations: (username) => AxiosClient.get(`/api/reservation/repairer/${username}`),
    getClientReservations: (username) => AxiosClient.get(`/api/reservation/client/${username}/list`),
    makeSuccess: (reservationId) => AxiosClient.put(`/api/reservation/${reservationId}/make-success`),
    genInvoice: (invoice) => AxiosClient.post(`/api/reservation/gen-invoice`, invoice),
    nonResolved: (id) => AxiosClient.put(`/api/reservation/${id}/not-resolved`),
    changeRepairer: (reqId, id, oldId) => AxiosClient.post(`/api/request/${reqId}/repairer/${id}/oldRepairer/${oldId}/changeReserv`),
    Affecter: (ref, affecter) => AxiosClient.post(`/api/reservation/Affecter/${ref}`, affecter),
}

export default ReservationApi;