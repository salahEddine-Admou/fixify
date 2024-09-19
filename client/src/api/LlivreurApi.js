import AxiosClient from "./axiosClient"

const LivreurApi = {
    getAll: () => AxiosClient.get("/api/admin/livreurs"),
    activate: (id) => AxiosClient.put(`/api/admin/activate-livreur/${id}`),
    desactivate: (id) => AxiosClient.put(`/api/admin/desactivate-livreur/${id}`),
    getReservationsByLivreur: (username) => AxiosClient.get(`/api/reservation/ReservationByLivreur/${username}`),
    activateDelivery: (id) => AxiosClient.put(`/api/livreur/makeDeleverySucces/${id}`),
    desactivateDelivery: (id) => AxiosClient.put(`/api/livreur/makeDeleveryNotSucces/${id}`),
    addDeliveryRetour: (reservationId, usernameLivreur) => AxiosClient.post(`/api/livreur/addDeliveryRetour/${reservationId}/${usernameLivreur}`),

    checkCin: (cin) => AxiosClient.post(`/api/livreur/check-available-cin/${cin}`),
    checkRib: (rib) => AxiosClient.post(`/api/livreur/check-available-rib/${rib}`),
}

export default LivreurApi