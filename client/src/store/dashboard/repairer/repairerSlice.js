import { createSlice } from '@reduxjs/toolkit';
import { getfavs, getAll, toggleActivation, SignUpRepairer, deleteRepairer, getAllProblems, getModelsByProblemId, assignProblemsToRepairer, getReparations, deleteRepationsByIdRepairer, getRepairerProfile, fetchSuccessfulReservationsCount, fetchTotalDevicesCount, toggleProStatus } from './repairerAction'; // Mettez à jour les noms d'importation

const initialState = {
    loading: false,
    error: null,
    success: false,
    repairers: [],
    problems: [],
    models: [],
    reparations: [],
    repairerProfile: null, // Ajout de l'état pour stocker le profil du réparateur
    successfulReservationsCount: 0,
    totalDevicesCount: 0,
};

// Création du slice Redux
const repairerSlice = createSlice({
    name: 'repairer',
    initialState: {
        repairers: [],
        loading: false,
        error: null,
    },
    reducers: {},
   
    extraReducers: {
        [toggleProStatus.pending]: (state) => {
            state.loading = true;
        },
        [toggleProStatus.fulfilled]: (state, action) => {
            state.loading = false;
            const {
                repairerId,
                isPro
                
            } = action.payload;

            const index = state.repairers.findIndex(repairer => repairer.id === repairerId);
          
            if (index !== -1) {
                state.repairers[index].pro = isPro;
            }

        },

        [toggleProStatus.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.payload?.error || 'Unknown error';
        },
        [getAll.pending]: (state) => {
            state.loading = true;
        },
        [getAll.fulfilled]: (state, action) => {
            state.loading = false;
            state.error = null;
            state.success = true;
            state.repairers = action.payload;
        },
        [getfavs.fulfilled]: (state, action) => {
            state.loading = false;
            state.error = null;
            state.success = true;
            state.repairers = action.payload
        },
        [getAll.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.payload.error;
        },
        // Ajoutez d'autres extraReducers ici si nécessaire
        [SignUpRepairer.fulfilled]: (state, action) => {
            state.loading = false;
            state.error = null;
            state.success = true;
            state.repairers.push(action.payload);
        },
        [SignUpRepairer.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.payload.error;
        },
        [deleteRepairer.fulfilled]: (state, action) => {
            state.loading = false;
            state.error = null;
            state.success = true;
            state.repairers = state.repairers.filter(repairer => repairer.id !== action.payload);
        },
        [getAllProblems.pending]: (state) => {
            state.loading = true;
        },
        [getAllProblems.fulfilled]: (state, action) => {
            state.loading = false;
            state.error = null;
            state.success = true;
            state.problems = action.payload;
        },
        [getAllProblems.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.payload.error;
        },
        [getModelsByProblemId.pending]: (state) => {
            state.loading = true;
        },
        [getModelsByProblemId.fulfilled]: (state, action) => {
            state.loading = false;
            state.error = null;
            state.success = true;
            state.models = action.payload;
        },
        [getModelsByProblemId.rejected]: (state, action) => { // Ajout de la gestion des erreurs lors du chargement des modèles
            state.loading = false;
            state.error = action.payload.error;
        },
        [assignProblemsToRepairer.fulfilled]: (state, action) => {
            state.loading = false;
            state.error = null;
            state.success = true;
        },
        [assignProblemsToRepairer.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.payload.error;
        },
        [getReparations.pending]: (state) => {
            state.loading = true;
            state.error = null;
        },
        [getReparations.fulfilled]: (state, action) => {
            state.loading = false;
            state.error = null;
            state.reparations = action.payload;
        },
        [getReparations.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        [deleteRepationsByIdRepairer.pending]: (state) => {
            state.loading = true;
        },
        [deleteRepationsByIdRepairer.fulfilled]: (state, action) => {
            state.loading = false;
            state.error = null;
            state.success = true;
            //  state.reparations = state.reparations.filter(reparation => reparation.reparateurId !== action.payload.reparateurId);
        },
        [deleteRepationsByIdRepairer.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        [getRepairerProfile.pending]: (state) => {
            state.loading = true;
            state.error = null;
        },
        [getRepairerProfile.fulfilled]: (state, action) => {
            state.loading = false;
            state.error = null;
            state.repairerProfile = action.payload;
        },
        [getRepairerProfile.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        [fetchSuccessfulReservationsCount.pending]: (state) => {
            state.loading = true;
        },
        [fetchSuccessfulReservationsCount.fulfilled]: (state, action) => {
            state.loading = false;
            state.error = null;
            state.successfulReservationsCount = action.payload;
        },
        [fetchSuccessfulReservationsCount.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        [fetchTotalDevicesCount.pending]: (state) => {
            state.loading = true;
        },
        [fetchTotalDevicesCount.fulfilled]: (state, action) => {
            state.loading = false;
            state.error = null;
            state.totalDevicesCount = action.payload;
        },
        [fetchTotalDevicesCount.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
    }
});

export default repairerSlice.reducer;
