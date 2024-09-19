import AxiosClient from "./axiosClient";
import { successToast,errorToast } from "../utils";
const ReviewApi = {

    addReview: async (newReview) => {
        try {
          const response = await AxiosClient.post("/api/review", newReview);
          return successToast(response.data);
        } catch (error) {
          console.log(error.response.data)
          alert(error.response.data)
          throw error;
        }
    },
    deleteReview: async(id)=>{
      try {
        const response = await AxiosClient.delete(`/api/review/${id}`);
        return response.data;
      } catch (error) {
        throw error;
      }
    }
}
export default ReviewApi