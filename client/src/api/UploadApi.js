import AxiosClient from "./axiosClient";

const UplaodApi = {
    uploadImage: (data, config) => AxiosClient.post("/api/auth/upload", data, config),
    uploadCinImage: (data, config) => AxiosClient.post("/api/auth/cin/upload", data, config),
    uploadPortfolioImage: (data, config) => AxiosClient.post(`/api/auth/portfolio/upload`, data, config),
    uploadImagReservation: (data, config) => AxiosClient.post(`/api/auth/imgReservation/upload`, data, config)
}

export default UplaodApi