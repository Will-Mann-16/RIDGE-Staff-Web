/*jshint esversion: 6 */
import { activateListener, disconnect } from '../socket';
import { readStudentsMajor } from './studentsActions';
import { readLocations } from './locationsActions';
import { axiosOpen, axiosToken } from '../constants';

export function createUser(user, house) {
  return dispatch => {
    dispatch({ type: 'CREATE_USER' });
    axiosToken
      .post('users/create', { user: user, house: house })
      .then(response => {
        if (response.status === 200 && response.data.success) {
          dispatch({ type: 'CREATE_USER_FULFILLED', payload: true });
        } else {
          dispatch({
            type: 'CREATE_USER_REJECTED',
            payload: response.data.reason
          });
        }
      })
      .catch(err => {
        dispatch({ type: 'CREATE_USER_REJECTED', payload: err });
      });
  };
}
export function readUser(token = localStorage.getItem('RIDGE-AUTH-TOKEN')) {
  return dispatch => {
    dispatch({ type: 'READ_USER' });
    axiosOpen
      .post('users/read', {
        jwt: token ? token : false
      })
      .then(response => {
        if (response.status === 200 && response.data.success) {
          dispatch(setActiveConfig(response.data.user.user.house));
          dispatch({
            type: 'READ_USER_FULFILLED',
            payload: { user: response.data.user, config: response.data.config }
          });
        } else if (response.status === 403 && response.data.empty) {
          dispatch({ type: 'READ_USER_EMPTY', payload: false });
        } else {
          dispatch({
            type: 'READ_USER_REJECTED',
            payload: response.data.reason
          });
        }
      })
      .catch(err => {
        dispatch({ type: 'READ_USER_REJECTED', payload: err });
      });
  };
}
export function updateUser(id, user, house) {
  return dispatch => {
    dispatch({ type: 'UPDATE_USER' });
    axiosToken
      .post('users/update', { id: id, user: user, house: house })
      .then(response => {
        if (response.status === 200 && response.data.success) {
          localStorage.setItem('AUTH-TOKEN', response.data.token);
          dispatch(readUser());
          dispatch({ type: 'UPDATE_USER_FULFILLED', payload: true });
        } else {
          dispatch({
            type: 'UPDATE_USER_REJECTED',
            payload: response.data.reason
          });
        }
      })
      .catch(err => {
        dispatch({ type: 'UPDATE_USER_REJECTED', payload: err });
      });
  };
}

export function deleteUser(id, house) {
  return dispatch => {
    dispatch({ type: 'DELETE_USER' });
    axiosToken
      .get('users/delete', { params: { id: id, house: house } })
      .then(response => {
        if (response.status === 200 && response.data.success) {
          dispatch({
            type: 'DELETE_USER_FULFILLED',
            payload: response.data.success
          });
        } else {
          dispatch({
            type: 'DELETE_USER_REJECTED',
            payload: response.data.reason
          });
        }
      })
      .catch(err => {
        dispatch({ type: 'DELETE_USER_REJECTED', payload: err });
      });
  };
}

export function authenticateUser(username, password) {
  return dispatch => {
    dispatch({ type: 'AUTHENTICATE_USER' });
    axiosOpen
      .post('users/authenticate', { username: username, password: password })
      .then(response => {
        if (response.data.success) {
          if (response.status === 403 && !response.data.authenticated) {
            dispatch({ type: 'AUTHENTICATE_USER_DENIED', payload: false });
          } else if (response.status === 200) {
            localStorage.setItem('RIDGE-AUTH-TOKEN', response.data.token);
            dispatch({ type: 'AUTHENTICATE_USER_FULFILLED', payload: true });
            dispatch(readUser(response.data.token));
          }
        } else {
          dispatch({
            type: 'AUTHENTICATE_USER_REJECTED',
            payload: response.data.reason
          });
        }
      })
      .catch(err => {
        dispatch({ type: 'AUTHENTICATE_USER_REJECTED', payload: err });
      });
  };
}

export function logoutUser() {
  return dispatch => {
    dispatch({ type: 'LOGOUT_USER' });
    localStorage.removeItem('RIDGE-AUTH-TOKEN');
    dispatch({ type: 'LOGOUT_USER_FULFILLED', payload: true });
    dispatch(readUser());
    //dispatch({type: "LOGOUT_USER_REJECTED", payload: err});
  };
}

export function changeUserHouse(house) {
  return dispatch => {
    disconnect();
    activateListener(house);
    dispatch(readStudentsMajor(house));
    dispatch(readLocations(house));
    dispatch(setActiveConfig(house));
    dispatch({ type: 'CHANGE_HOUSE_USER', payload: house });
  };
}
export function setActiveConfig(house) {
  return dispatch => {
    dispatch({ type: 'SET_CONFIG' });
    axiosToken
      .get('users/read-config', { params: { house: house } })
      .then(response => {
        if (response.status === 200 && response.data.success) {
          dispatch({
            type: 'SET_CONFIG_FULFILLED',
            payload: response.data.config
          });
        } else {
          dispatch({
            type: 'SET_CONFIG_REJECTED',
            payload: response.data.reason
          });
        }
      })
      .catch(err => {
        dispatch({ type: 'SET_CONFIG_REJECTED', payload: err });
      });
  };
}
