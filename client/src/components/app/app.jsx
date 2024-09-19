import { Route, Routes } from 'react-router-dom';
import Styles from './app.module.scss';
import { Login } from '../../pages/login/login';
import { Register } from '../../pages/register/register';
import { PrivateRoute } from '../privateRoute/privateRoute';
import { PublicRoute } from '../publicRoute/publicRoute';
import 'animate.css';
import { message } from 'antd';
import EmailConfirmation from '../../pages/EmailConfirmation/EmailConfirmation';
import home from '../../pages/home/home';
import { Toaster } from 'react-hot-toast';
import Dashboard from '../../pages/admin/dashboard/Dashboard';
import ListSupport from '../../pages/admin/personnel/support/list/ListSupport';
import AddSupport from '../../pages/admin/personnel/support/add/AddSupport';
import EditSupport from '../../pages/admin/personnel/support/edit/EditSupport';
import ClientList from '../../pages/admin/personnel/client/list/ClientList';
import ListRepairer from '../../pages/admin/personnel/repairer/list/ListRepairer';
import AddLivreur from '../../pages/admin/personnel/livreur/add/AddLivreur';
import ListLivreur from '../../pages/admin/personnel/livreur/list/ListLivreur';
import ModelList from '../../pages/support/device/model/list/ModelList';
import SubCategoryList from '../../pages/support/device/subCategory/ListSubCategory';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { verifyToken } from '../../store/auth/authActions';
import SupportDashboard from '../../pages/support/dashboard/SupportDashboard';
import ProblemList from '../../pages/support/device/problemType/ProblemList';
import CategoryModelList from '../../pages/support/device/categorymodel/Listcategorymodel';
import SearchRepairers from '../../pages/client/search-repairers/SearchRepairers';
import RepairerDetail from '../../pages/client/search-repairers/repairer-detail/RepairerDetail';
import ListReservation from '../../pages/support/reservation/ListReservation';
import RepairerDashboard from '../../pages/repairer/dashboard/RepairerDashboard';
import RepairerProfile from '../../pages/repairer/profile/RepairerProfile';
import LivreurDashboard from '../../pages/livreur/dashboard/LivreurDashboard';
import LivreurReservation from '../../pages/livreur/hisreservations/LivreurReservation';
import NewSingleReservaton from '../../pages/livreur/new-single-reservation/NewSingleReservaton';
import ReservationList from '../../pages/repairer/reservation-list/ReservationList';
import About from '../../pages/about/About';
import Blog from '../../pages/blog/Blog';
import GuidesAdmin from '../../pages/admin/guides/Guides';
import Testimonial from '../../pages/home/testimonial/Testimonial';
import AddTestimoniale from '../../pages/admin/testimonial/addtestimonial';


import ClientDashboard from '../../pages/client-dash/dashboard/ClientDashboard';
import FavRepairers from '../../pages/client-dash/fav-repairers/FavRepairers';
import NewRequest from '../../pages/admin/new-request/NewRequest';
import NotFound from '../../pages/notfound/notfound';
import ChangePassword from '../../pages/EmailConfirmation/ChangePassword';
import OtherReservation from '../../pages/admin/reservation-ProblemOther/otherReservation';

export const App = () => {
	const { user, accessToken } = useSelector((state) => state.auth);

	const disptatch = useDispatch();
	useEffect(() => {
		if (accessToken)
			disptatch(verifyToken(accessToken))
	}, [])




	return (

		<div  >
			<Toaster position="bottom-center" />
			<Layout>
				<Routes>
					<Route path="/" element={<PublicRoute component={home} />} />
					<Route path='/login' element={<PublicRoute restricted={true} component={Login} />} />
					<Route path='/register' element={<PublicRoute restricted={true} component={Register} />} />
					<Route path='/auth/accountverification/:verificationToken' element={<PublicRoute restricted={true} component={EmailConfirmation} />} />

					{/* Admin routes */}

					<Route path='/admin/testimonial/create' element={<PrivateRoute component={AddTestimoniale} requiredRole="admin" />} />

					<Route path='/admin/dashboard' element={<PrivateRoute component={Dashboard} requiredRole="admin" />} />
					<Route path='/admin/support' element={<PrivateRoute component={ListSupport} requiredRole="admin" />} />
					<Route path='/admin/support/edit/:id' element={<PrivateRoute component={EditSupport} requiredRole="admin" />} />
					<Route path='/admin/support/create' element={<PrivateRoute component={AddSupport} requiredRole="admin" />} />
					<Route path='/admin/clients' element={<PrivateRoute component={ClientList} requiredRole="admin" />} />
					<Route path='/admin/repairer' element={<PrivateRoute component={ListRepairer} requiredRole="admin" />} />

					<Route path='/admin/livreur/create' element={<PrivateRoute component={AddLivreur} requiredRole="admin" />} />
					<Route path='/admin/livreurs' element={<PrivateRoute component={ListLivreur} />} requiredRole="admin" />
					<Route path='/admin/reservations' element={<PrivateRoute component={ReservationList} requiredRole="admin" />} />

					<Route path='/admin/new-request/:id' element={<PrivateRoute component={NewRequest} requiredRole="admin" />} />

					<Route path='/admin/livreur/create' element={<PrivateRoute component={AddLivreur} />} />
					<Route path='/admin/livreurs' element={<PrivateRoute component={ListLivreur} />} />
					<Route path='/admin/reservations' element={<PrivateRoute component={ReservationList} requiredRole="admin" />} />
					<Route path='/admin/guides' element={<PrivateRoute component={GuidesAdmin} requiredRole="admin" />} />

					<Route path='/admin/new-request/:id' element={<PrivateRoute component={NewRequest} requiredRole="admin" />} />

					{/* Support routes */}
					<Route path="/support/categoryModel" element={<PrivateRoute component={CategoryModelList} requiredRole="admin" />} />
					<Route path='/support/marques' element={<PrivateRoute component={SubCategoryList} requiredRole="admin" />} />
					<Route path='/support/models' element={<PrivateRoute component={ModelList} />} requiredRole="admin" />
					<Route path='/support/problems' element={<PrivateRoute component={ProblemList} requiredRole="admin" />} />
					<Route path='/admin/otherReservation' element={<PrivateRoute component={OtherReservation} requiredRole="admin" />} />

					{/* Support routes 
					<Route path='/support/dashboard' element={<PrivateRoute component={SupportDashboard} />} />
					<Route path="/support/categoryModel" element={<PrivateRoute component={CategoryModelList} />} />
					<Route path='/support/marques' element={<PrivateRoute component={SubCategoryList} />} />
					<Route path='/support/models' element={<PrivateRoute component={ModelList} />} />
					<Route path='/support/problems' element={<PrivateRoute component={ProblemList} />} />
					<Route path='/support/repairer' element={<PrivateRoute component={ListRepairer} />} />
					<Route path='/support/list-reservation' element={<PrivateRoute component={ListReservation} />} />*/}



					{/* Client routes */}
					<Route path='/front/search-repairers' element={<PublicRoute component={SearchRepairers} />} />
					<Route path='/front/repairer/:id' element={<PublicRoute component={RepairerDetail} />} />
					<Route path='/front/new-reservation/:id' element={<PrivateRoute type="aller" component={NewSingleReservaton} />} />
					<Route path='/front/new-reservation/deliver-back/:id' element={<PrivateRoute type="retour" component={NewSingleReservaton} />} />

					<Route path='/client/dashboard' element={<PrivateRoute component={ClientDashboard} />} />
					<Route path='/client/fav-repairers' element={<PrivateRoute component={FavRepairers} />} />
					<Route path='/front/changePassword/:id' element={<PublicRoute type="retour" component={ChangePassword} />} />
					<Route path='/client/list-resevation' element={<PrivateRoute type="retour" component={ReservationList} requiredRole="client" />} />


					{/* Repairer routes */}
					<Route path='/repairer/tarifs' element={<PrivateRoute component={ModelList} requiredRole="repairer" />} />
					<Route path='/repairer/dashboard' element={<PrivateRoute component={RepairerDashboard} requiredRole="repairer" />} />
					<Route path='/repairer/profile' element={<PrivateRoute component={RepairerProfile} requiredRole="repairer" />} />
					<Route path='/repairer/reservations' element={<PrivateRoute component={ReservationList} requiredRole="repairer" />} />

					{/* Livreur routes */}
					<Route path='/livreur/dashboard' element={<PrivateRoute component={LivreurDashboard} requiredRole="livreur" />} />
					<Route path='/livreur/reservation' element={<PrivateRoute component={LivreurReservation} requiredRole="livreur" />} />

					{/* About */}
					<Route path='/about' element={<PublicRoute component={About} />} />

					{/* NotFound */}
					<Route path='*' element={<PublicRoute component={NotFound} />} />


					<Route path='/blog' element={<PrivateRoute component={Blog} />} />
					<Route path='/about' element={<PrivateRoute component={About} />} />
					{/* Testimonials route */}
					<Route path="/testimonials/:id" element={<PublicRoute component={Testimonial} />} />


					<Route path='/blog' element={<PublicRoute component={Blog} />} />
				</Routes >
			</Layout >
		</div >

	);
}

const Layout = ({ children }) => {

	return (
		<div className={Styles.mainContainer}>

			<div className={Styles.contentContainer}>
				{children}
			</div>
		</div>
	);
}