import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import { injectStore } from '../utils/axiosConfig';
import clientReducer from './dashboard/client/clientSlice';
import repairerReducer from './dashboard/repairer/repairerSlice';
import subCategoryReducer from './dashboard/subCategory/subCategorySlice';
import CategoryModelReducer from './dashboard/category/CategoryModelSlice'
import problemTypeReducer from './dashboard/problemType/problemTypeSlice';
import ModelSlice from './dashboard/model/ModelSlice';
import reservationSlice from './front/reservationSlice';
import livreurReducer from './dashboard/livreur/livreurSlice';
import blogReducer from './blogpage/blogSlice';
import testimonialSlice from './testimonial/testimonialSlice';

const store = configureStore({
	reducer: {
		auth: authReducer,
		client: clientReducer,
		repairer: repairerReducer,
		subCategory: subCategoryReducer,
		problemType: problemTypeReducer,
		category: CategoryModelReducer,
		livreur: livreurReducer,
		model: ModelSlice,
		reservation: reservationSlice,
		blogs: blogReducer,
		testimonial:testimonialSlice,
	}
});

injectStore(store);

export default store;
