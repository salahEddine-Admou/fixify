import AxiosClient from "./axiosClient";

const AuthApi = {
    signupClient: (data) => AxiosClient.post("/api/auth/signup", data),
    signupLivreur: (data) => AxiosClient.post("/api/auth/livreur/signup", data),
    login: (data) => AxiosClient.post("/api/auth/login", data),
    logout: (data) => AxiosClient.post("/api/auth/logout", data),
    confirmEmail: (token) => AxiosClient.post(`/api/auth/accountverification/${token}`),
    verifyToken: (token) => AxiosClient.post(`/api/auth/verify/${token}`),
    checkUsername: (data) => AxiosClient.post('/api/auth/check-available', data),
    emailChangePassword: (email) => AxiosClient.post(`/api/auth/emailChangePassByEmail/${email}`),
    getStats:()=>AxiosClient.get("/api/admin/stats"),
    getReservationByGender:()=>AxiosClient.get("/api/admin/reservations-by-gender"),
    getTopFiveClien:()=>AxiosClient.get("/api/admin/top-clients"),
    getTopFiveRepairer:()=>AxiosClient.get("/api/admin/top-reparateurs"),
    getReservationByCity:()=>AxiosClient.get("/api/admin/reservations/by-city"),
    getReservationByCategory:() => AxiosClient.get(`/api/admin/count-by-category`),

}

export default AuthApi