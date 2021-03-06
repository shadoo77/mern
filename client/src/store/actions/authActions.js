import axios from 'axios';
import jwt_decode from 'jwt-decode';
import setAuthToken from '../../utils/setAuthToken';

import { GET_ERRORS, SET_CURRENT_USER } from './types';

// Register user

export const registerUser = (userData, history) => (dispatch) => {
	axios
		.post('/api/users/register', userData)
		.then((res) => {
			dispatch({
				type: GET_ERRORS,
				payload: {}
			});
			history.push('/login');
		})
		.catch((err) =>
			dispatch({
				type: GET_ERRORS,
				payload: err.response.data
			})
		);
};

// Login Get user token

export const loginUser = (userData) => (dispatch) => {
	axios
		.post('/api/users/login', userData)
		.then((res) => {
			const { token } = res.data;
			localStorage.setItem('jwtToken', token);
			setAuthToken(token);
			const decoded = jwt_decode(token);
			dispatch(setCurrentUser(decoded));
			dispatch({
				type: GET_ERRORS,
				payload: {}
			});
		})
		.catch((err) =>
			dispatch({
				type: GET_ERRORS,
				payload: err.response.data
			})
		);
};

// Set loged in user
export const setCurrentUser = (decoded) => {
	return {
		type: SET_CURRENT_USER,
		payload: decoded
	};
};

// Log user out
export const logoutUser = () => (dispatch) => {
	// Remove token from localStorage
	localStorage.removeItem('jwtToken');
	// Remove auth header from future requests
	setAuthToken(false);
	// Set current user to empty object which will set isAuthenticated false
	dispatch(setCurrentUser({}));
};
