import axios from 'axios';

let store;

export const injectStore = (_store) => {
	store = _store;
};

export const apiErrorResponse = (error) => {
	if (error.response) {
		console.log(error.response.data);
		console.log(error.response.status);
		console.log(error.response.headers);
	} else if (error.request) {
		console.log(error.request);
	} else {
		console.log('Error', error.message);
	}
};

const AxiosClient = axios.create({
	baseURL: 'http://127.0.0.1:8082',
	withCredentials: true
});

AxiosClient.interceptors.request.use(
	(config) => {
		const accessToken = localStorage.getItem("userAccessToken");

		if (accessToken) {
			config.headers = {
				Authorization: `Bearer ${accessToken}`,
				Accept: 'application/json'
			};
		}

		return config;
	},
	(err) => Promise.reject(err)
);

let calledOnce = false;

// AxiosClient.interceptors.response.use((response) => {
// 	return response;
// }, async (error) => {
// 	const originalRequest = error.config;

// 	if (error.response !== null) {
// 		if (error.response.status === 403 && !originalRequest._retry) {
// 			if (!calledOnce) {
// 				calledOnce = true;

// 				try {
// 					const refreshData = await AxiosClient.get('/refresh_token/verify');

// 					if (refreshData) {
// 						const { user } = store.getState().auth;
// 						axios.defaults.headers.common.Authorization = `Bearer ${refreshData.data.access_token}`;

// 						store.dispatch(setCredentials({
// 							user,
// 							access_token: refreshData.data.access_token
// 						}));

// 						return AxiosClient(originalRequest);
// 					}
// 				} catch (error) {
// 					if (error.response && error.response.data) {
// 						return Promise.reject(error.response.data);
// 					}

// 					return Promise.reject(error);
// 				} finally {
// 					originalRequest._retry = true;
// 					calledOnce = false;
// 				}
// 			}
// 		}
// 	}

// 	return Promise.reject(error);
// });

export default AxiosClient;
