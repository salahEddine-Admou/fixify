import { createAsyncThunk } from '@reduxjs/toolkit';
import RepairerApi from '../../../api/repairerApi';
import { errorToast, successToast } from '../../../utils';

export const getAll = createAsyncThunk('repairer/getAll', async (_, { rejectWithValue }) => {
    try {
        const response = await RepairerApi.getAll();
        console.log("repairer response", response.data);
        return response.data;
    } catch (error) {
        console.log("error", error.response.data);
        return rejectWithValue({
            error: error.response.data ? error.response.data : error
        });
    }
});
export const getfavs = createAsyncThunk('repairer/getFav', async ({ user }, { rejectWithValue }) => {
    try {
        const response = await RepairerApi.listFav(user)
        console.log("repairer response", response.data);
        return await response.data;
    } catch (error) {
        console.log("error", error.response.data);
        return rejectWithValue({
            error: error.response.data ? error.response.data : error
        });
    }
});
export const toggleActivation = createAsyncThunk('repairer/toggleActivation', async ({ mode, id }, { rejectWithValue }) => {
    try {
        if (mode) {
            await RepairerApi.activate(id);
            successToast("activating");
            return { id, active: 1 };
        } else {
            successToast("desactivating");
            await RepairerApi.desactivate(id);
            return { id, active: 0 };
        }
    } catch (error) {
        console.log("error", error.response.data);
        return rejectWithValue({
            error: error.response.data ? error.response.data : error
        });
    }
});

export const SignUpRepairer = createAsyncThunk('repairer/addRepairer', async (repairerData, { rejectWithValue }) => {
    try {
        const response = await RepairerApi.SignUp(repairerData);
        successToast(response.data);
        return response.data;
    } catch (error) {
        console.log("Error adding repairer:", error.response.data);
        return rejectWithValue({
            error: error.response.data ? error.response.data : error
        });
    }
});

export const deleteRepairer = createAsyncThunk('repairer/deleteRepairer', async (repairerId, { rejectWithValue }) => {
    try {
        const response = await RepairerApi.deleteRepairer(repairerId);
        successToast("delete repairer");
        return repairerId;
    } catch (error) {
        errorToast(error.response.data);
        console.log("Error deleting repairer:", error.response.data);
        return rejectWithValue({
            error: error.response.data ? error.response.data : error
        });
    }
});

export const getAllProblems = createAsyncThunk('problems/getAll', async (_, { rejectWithValue }) => {
    try {
        const response = await RepairerApi.getAllProblems();
        console.log("problem response", response.data);
        return response.data;
    } catch (error) {
        console.log("error", error.response.data);
        return rejectWithValue({
            error: error.response.data ? error.response.data : error.message
        });
    }
});

export const getModelsByProblemId = createAsyncThunk('models/getByProblemId', async (problemId, { rejectWithValue }) => {
    try {
        const response = await RepairerApi.getModelsByProblemId(problemId);
        console.log("models response", response.data);
        return response.data;
    } catch (error) {
        console.log("error", error.response.data);
        return rejectWithValue({
            error: error.response.data ? error.response.data : error.message
        });
    }
});

export const toggleProStatus = createAsyncThunk(
    'repairer/toggleProStatus',
    async ({ repairerId, isPro }, { rejectWithValue }) => {
        try {

            if (isPro) {
                await RepairerApi.enablePro(repairerId);
            } else {
                await RepairerApi.disablePro(repairerId);
            }
            return {
                repairerId,
                isPro

            };
        } catch (error) {
            console.error("Error updating repairer's status:", error);
            return rejectWithValue({
                error: error.response ? error.response.data : error.message,
            });
        }
    }
);

export const assignProblemsToRepairer = createAsyncThunk(
    'repairer/assignProblems',
    async ({ requestBody, repairerId }, { rejectWithValue }) => {
        try {
            const response = await RepairerApi.assignProblems(requestBody, repairerId);
            return response.data;
        } catch (error) {
            console.error("Erreur lors de l'affectation des problèmes au réparateur:", error);
            return rejectWithValue({
                error: error.response ? error.response.data : error.message
            });
        }
    }
);

export const getReparations = createAsyncThunk(
    'repairer/getReparations',
    async (repairerId, { rejectWithValue }) => {
        try {
            const response = await RepairerApi.getReparations(repairerId);
            console.log("ha hiya", response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching reparations:', error);
            return rejectWithValue(error.response.data ? error.response.data : error.message);
        }
    }
);

export const deleteRepationsByIdRepairer = createAsyncThunk(
    'repairer/deleteRepationsByIdRepairer',
    async (repairerId, { rejectWithValue }) => {
        try {
            const response = await RepairerApi.deleteReparationsByIdReparateur(repairerId);
            return response.data;
        } catch (error) {
            console.error('Error fetching reparations:', error);
            return rejectWithValue(error.response.data ? error.response.data : error.message);
        }
    }
);

export const getRepairerProfile = createAsyncThunk(
    'repairer/getRepairerProfile',
    async (id, { rejectWithValue }) => {
        try {
            const response = await RepairerApi.getRepairerProfile(id);
            return response.data;
        } catch (error) {
            console.error('Error fetching repairer profile:', error);
            return rejectWithValue(error.response.data ? error.response.data : error.message);
        }
    }
);


// Définition de l'action pour mettre à jour le nombre de réservations réussies
export const setSuccessfulReservationsCount = (count) => {
    return { type: 'repairer/setSuccessfulReservationsCount', payload: count };
};

// Définition de l'action pour mettre à jour le nombre total d'appareils
export const setTotalDevicesCount = (count) => {
    return { type: 'repairer/setTotalDevicesCount', payload: count };
};

// Action asynchrone pour récupérer le nombre de réservations réussies
export const fetchSuccessfulReservationsCount = (repairerId) => {
    return async (dispatch) => {
        try {
            const response = await RepairerApi.getSuccessfulReservationsCount(repairerId);
            dispatch(setSuccessfulReservationsCount(response.data));
        } catch (error) {
            console.error("Error fetching successful reservations count:", error);
        }
    };
};

// Action asynchrone pour récupérer le nombre total d'appareils
export const fetchTotalDevicesCount = (repairerId) => {
    return async (dispatch) => {
        try {
            const response = await RepairerApi.getTotalDevicesCount(repairerId);
            dispatch(setTotalDevicesCount(response.data));
        } catch (error) {
            console.error("Error fetching total devices count:", error);
        }
    };
};