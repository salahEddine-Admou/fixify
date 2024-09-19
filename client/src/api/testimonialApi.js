import AxiosClient from "./axiosClient"; // Assurez-vous que le client Axios est correctement configuré

const testimonialApi = {
    getAll: () => AxiosClient.get("/api/testimonials"),

    add: (testimonial) => AxiosClient.post("/api/testimonials", testimonial),

    update: (testimonialId, updatedTestimonial) => AxiosClient.put(`/api/testimonials/${testimonialId}`, updatedTestimonial),

    delete: (testimonialId) => AxiosClient.delete(`/api/testimonials/${testimonialId}`)
};

export default testimonialApi;
