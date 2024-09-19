import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosConfig from '../../utils/axiosConfig';
import AuthApi from '../../api/AuthApi';
import RepairerApi from '../../api/repairerApi';

export const registerClient = createAsyncThunk('user/register', async (client, { rejectWithValue }) => {
	try {
		const response = await AuthApi.signupClient(client)

		console.log("signup response", response.data);
		return await response.data;
	} catch (error) {
		console.log("error", error.response.data);
		return rejectWithValue({
			error: error.response.data ? error.response.data : error
		});
	}
});

export const SignUpRepairer = createAsyncThunk('aith/signupRepairer', async (repairerData, { rejectWithValue }) => {
	try {
		const response = await RepairerApi.SignUp(repairerData);
		return response.data;
	} catch (error) {
		console.log("Error adding repairer:", error.response.data);
		return rejectWithValue({
			error: error.response.data ? error.response.data : error
		});
	}
});
export const registerLivreur = createAsyncThunk('user/register-ivreur', async (livreur, { rejectWithValue }) => {
	try {
		const response = await AuthApi.signupLivreur(livreur)
		console.log("signup livreur response", response.data);
		return await response.data;
	} catch (error) {
		console.log("error", error.response.data);
		return rejectWithValue({
			error: error.response.data ? error.response.data : error
		});
	}
});

export const loginUser = createAsyncThunk('user/login', async ({
	username, password
}, { rejectWithValue }) => {
	try {
		const response = await AuthApi.login({
			username, password
		})
		console.log("auth data ", response.data);

		return await response.data;
	} catch (error) {
		console.log("auth error", error.response.data);
		return rejectWithValue({
			error: error.response.data ? error.response.data : error.message
		});
	}
});

export const verifyUserDetails = createAsyncThunk('user/verify', async (_, { rejectWithValue }) => {
	try {
		const response = await axiosConfig.get('/verify/user');

		return await response.data;
	} catch (error) {
		return rejectWithValue({
			error: error.response.data ? error.response.data.message : error.message
		});
	}
});

export const logoutUser = createAsyncThunk('user/logout', async (data, { rejectWithValue }) => {
	try {
		const response = await AuthApi.logout(data);
		console.log("logout adata", response.data);
		return response.data;
	} catch (error) {
		return rejectWithValue({
			error: error.response.data ? error.response.data.message : error.message
		});
	}
});


export const verifyToken = createAsyncThunk('user/verify-token', async (token, { rejectWithValue }) => {
	try {
		console.log("verifying token");
		const response = await AuthApi.verifyToken(token);
		return response.data;
	} catch (error) {
		return rejectWithValue({
			error: error.response.data ? error.response.data.message : error.message
		});
	}
});

