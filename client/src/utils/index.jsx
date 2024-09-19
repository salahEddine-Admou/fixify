import toast from 'react-hot-toast';


export const successToast = (message) => {

	toast.success(message, {
		style: {
			background: '#333',
			color: '#fff',
		},
	});
};

export const errorToast = (message, messageApi) => {
	messageApi.open({
		type: 'error',
		content: message,
		placement: "bottom"
	});
};
