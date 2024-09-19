import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import reportWebVitals from './reportWebVitals';
import { App } from './components/app/app';
import { ConfigProvider } from 'antd';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

const root = ReactDOM.createRoot(document.getElementById('root'));


root.render(
	<Provider store={store}>
		<Router>
			<App />
		</Router>
	</Provider>
);

reportWebVitals();
