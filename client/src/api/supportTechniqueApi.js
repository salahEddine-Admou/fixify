import AxiosClient from './axiosClient';

const checkUsernameAvailability = async (username) => {
    try {
        const response = await AxiosClient.post('/api/checkUsernameAvailability', { username });
        return response.data.available;
    } catch (error) {
        console.error('Erreur lors de la vérification de la disponibilité du nom d\'utilisateur:', error);
        return false;
    }
};

const checkEmailAvailability = async (email) => {
    try {
        const response = await AxiosClient.post('/api/checkEmailAvailability', { email });
        return response.data.available;
    } catch (error) {
        console.error('Erreur lors de la vérification de la disponibilité de l\'e-mail:', error);
        return false;
    }
};


const getAllSupportsTechnique = async () => {
    const response = await AxiosClient.get('/api/SupportTechnique');
    console.log(response.data);
    return response.data;
};

const getSupportTechniqueById = async (id) => {
    const response = await AxiosClient.get(`/api/SupportTechnique/${id}`);
    return response.data;
};

const createSupportTechnique = async (supportTechnique) => {
    console.log(supportTechnique);
    const response = await  AxiosClient.post(`/api/SupportTechnique`, supportTechnique);
    return response.data;
};

const updateSupportTechnique = async (id, supportTechnique) => {
    const response = await AxiosClient.put(`/api/SupportTechnique/${id}`, supportTechnique);
    console.log(response.data);
    return response.data;
};

const deleteSupportTechnique = async (id) => {
    await AxiosClient.delete(`/api/SupportTechnique/${id}`);
};

const updateRepairer=async (id,repairerData)=>{
    console.log(repairerData);
    const response=await AxiosClient.put(`/api/Repairer/${id}`,repairerData);
    return response.data;
}

export { getAllSupportsTechnique, getSupportTechniqueById, createSupportTechnique, updateSupportTechnique, deleteSupportTechnique,checkUsernameAvailability,
    checkEmailAvailability,updateRepairer };
