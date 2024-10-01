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
    baseURL: process.env.NODE_ENV === 'production' ? 'https://fixi-fy.com' : 'http://127.0.0.1:8082',
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
export default AxiosClient;
