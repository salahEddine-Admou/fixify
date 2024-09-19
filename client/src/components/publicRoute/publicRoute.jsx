import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { Navbar } from '../navbar/navbar';


export const PublicRoute = ({ component: Component, ...props }) => {
	const { user } = useSelector((state) => state.auth);

	return (
		<>
			<Navbar />
			<div className=''>



				<Component {...props} />

			</div>
		</>
	);
};
