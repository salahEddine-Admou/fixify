import { createSlice } from '@reduxjs/toolkit';
import {
	loginUser, logoutUser, registerLivreur, registerClient, verifyToken, verifyUserDetails,
	SignUpRepairer
} from './authActions';

const userAccessToken = localStorage.getItem('userAccessToken')
	? localStorage.getItem('userAccessToken')
	: null;

const user = localStorage.getItem('user')
	? localStorage.getItem('user')
	: null;

const refreshToken = localStorage.getItem('refreshToken')
	? localStorage.getItem('refreshToken')
	: null;
const role = localStorage.getItem('role')
	? localStorage.getItem('role')
	: null;

const initialState = {
	loading: false,
	role: role,
	refreshToken: refreshToken,
	user: user,
	accessToken: userAccessToken,
	error: null,
	success: false,
};

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		setCredentials: (state, action) => {
			state.user = action.payload.user;
			state.accessToken = action.payload.access_token;

			localStorage.setItem('userAccessToken', action.payload.access_token);
		},
		clearErrors: (state, action) => {
			state.error = null
		}
	},
	extraReducers: {
		[registerClient.pending]: (state) => {
			state.loading = true;
		},
		[registerClient.fulfilled]: (state, action) => {
			state.loading = false;
			state.error = null;
			state.success = true;
		},
		[registerClient.rejected]: (state, action) => {
			state.loading = false;
			state.error = action.payload.error;
		},
		[registerLivreur.pending]: (state) => {
			state.loading = true;
		},
		[registerLivreur.fulfilled]: (state, action) => {
			state.loading = false;
			state.error = null;
			state.success = true;
		},
		[registerLivreur.rejected]: (state, action) => {
			state.loading = false;
			state.error = action.payload.error;
		},
		[SignUpRepairer.pending]: (state) => {
			state.loading = true;
		},
		[SignUpRepairer.fulfilled]: (state, action) => {
			state.loading = false;
			state.error = null;
			state.success = true;
		},
		[SignUpRepairer.rejected]: (state, action) => {
			state.loading = false;
			state.error = action.payload.error;
		},

		[loginUser.pending]: (state) => {
			state.loading = true;
		},
		[loginUser.fulfilled]: (state, action) => {
			state.loading = false;
			state.user = action.payload.username;
			state.accessToken = action.payload.authenticationToken;
			state.role = action.payload.role;
			state.refreshToken = action.payload.refreshToken;
			localStorage.setItem('userAccessToken', action.payload.authenticationToken);
			localStorage.setItem('user', action.payload.username);
			localStorage.setItem('refreshToken', action.payload.refreshToken);
			localStorage.setItem('role', action.payload.role);
			state.error = null;
		},
		[loginUser.rejected]: (state, action) => {
			state.loading = false;
			state.error = action.payload.error;
		},

		[logoutUser.pending]: (state) => {
			state.loading = true;
		},
		[logoutUser.fulfilled]: (state) => {
			state.loading = false;
			state.user = null;
			state.accessToken = null;
			state.refreshToken = null;
			state.role = null;
			localStorage.removeItem('userAccessToken');
			localStorage.removeItem('user');
			localStorage.removeItem('refreshToken');
			localStorage.removeItem('role');
			state.success = true;
			state.error = null;
		},
		[logoutUser.rejected]: (state, action) => {
			state.loading = false;
			state.error = action.payload.error;
		},

		[verifyUserDetails.pending]: (state) => {
			state.loading = true;
		},
		[verifyUserDetails.fulfilled]: (state, action) => {
			state.loading = false;
			state.user = action.payload.user_details;
			state.error = null;
		},
		[verifyUserDetails.rejected]: (state) => {
			state.loading = false;
		},
		[verifyToken.rejected]: (state) => {
			state.loading = false;
			state.user = null;
			state.accessToken = null;
			state.refreshToken = null;
			state.role = null;
			localStorage.removeItem('userAccessToken');
			localStorage.removeItem('user');
			localStorage.removeItem('refreshToken');
			localStorage.removeItem('role');
			state.success = true;
			state.error = null;
		},


	},
});

export default authSlice.reducer;

export const { setCredentials, clearErrors } = authSlice.actions;
