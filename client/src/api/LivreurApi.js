import axios from 'axios';
const BASE_URL = 'http://localhost:8080/api/livreur'; // Assurez-vous de remplacer l'URL par celle de votre API backend

const getAllLivreur = async () => {
    try {
        const response = await axios.get(BASE_URL);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la récupération de tous les livreurs :', error);
        throw error;
    }
};

const getLivreurById = async (id) => {
    try {
        const response = await axios.get(`${BASE_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Erreur lors de la récupération du livreur avec l'ID ${id} :`, error);
        throw error;
    }
};

const createLivreur = async (Livreur) => {
    try {
        const response = await axios.post(BASE_URL, Livreur);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la création du livreur :', error);
        throw error;
    }
};

const updateLivreur = async (id, Livreur) => {
    try {
        const response = await axios.put(`${BASE_URL}/${id}`, Livreur);
        return response.data;
    } catch (error) {
        console.error(`Erreur lors de la mise à jour du livreur avec l'ID ${id} :`, error);
        throw error;
    }
};

const deleteLivreur = async (id) => {
    try {
        await axios.delete(`${BASE_URL}/${id}`);
    } catch (error) {
        console.error(`Erreur lors de la suppression du livreur avec l'ID ${id} :`, error);
        throw error;
    }
};

export { getAllLivreur, getLivreurById, createLivreur, updateLivreur, deleteLivreur };
