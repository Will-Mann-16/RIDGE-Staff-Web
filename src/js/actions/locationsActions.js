/*jshint esversion: 6 */
import { emit } from './../socket.js';
import { axiosToken } from '../constants';
export function createLocation(location, house) {
  return dispatch => {
    dispatch({ type: 'CREATE_LOCATION' });
    axiosToken
      .post('locations/create', { location: location, house: house })
      .then(response => {
        if (response.status === 200 && response.data.success) {
          dispatch(readLocations(house));
          emit('socket-client-server-redraw-major');
          dispatch({
            type: 'CREATE_LOCATION_FULFILLED',
            payload: response.data.success
          });
        } else {
          dispatch({
            type: 'CREATE_LOCATION_REJECTED',
            payload: response.data.reason
          });
        }
      })
      .catch(err => {
        dispatch({ type: 'CREATE_LOCATION_REJECTED', payload: err });
      });
  };
}
export function readLocations(house) {
  return dispatch => {
    dispatch({ type: 'READ_LOCATIONS' });
    axiosToken
      .get('locations/read', { params: { house: house } })
      .then(response => {
        if (response.status === 200 && response.data.success) {
          dispatch({
            type: 'READ_LOCATIONS_FULFILLED',
            payload: response.data.locations
          });
        } else {
          dispatch({
            type: 'READ_LOCATIONS_REJECTED',
            payload: response.data.reason
          });
        }
      })
      .catch(err => {
        dispatch({ type: 'READ_LOCATIONS_REJECTED', payload: err });
      });
  };
}

export function updateLocation(id, location, house) {
  return dispatch => {
    dispatch({ type: 'UPDATE_LOCATION' });
    axiosToken
      .post('locations/update', { id: id, location: location, house: house })
      .then(response => {
        if (response.status === 200 && response.data.success) {
          dispatch(readLocations(location._house));
          emit('socket-client-server-redraw-major');
          dispatch({
            type: 'UPDATE_LOCATION_FULFILLED',
            payload: response.data.location
          });
        } else {
          dispatch({
            type: 'UPDATE_LOCATION_REJECTED',
            payload: response.data.reason
          });
        }
      })
      .catch(err => {
        dispatch({ type: 'UPDATE_LOCATION_REJECTED', payload: err });
      });
  };
}

export function deleteLocation(id, house) {
  return dispatch => {
    dispatch({ type: 'DELETE_LOCATION' });
    axiosToken
      .get('locations/delete', { params: { id: id, house: house } })
      .then(response => {
        if (response.status === 200 && response.data.success) {
          emit('socket-client-server-redraw-major');
          dispatch({
            type: 'DELETE_LOCATION_FULFILLED',
            payload: response.data.success
          });
        } else {
          dispatch({
            type: 'DELETE_LOCATION_REJECTED',
            payload: response.data.reason
          });
        }
      })
      .catch(err => {
        dispatch({ type: 'DELETE_LOCATION_REJECTED', payload: err });
      });
  };
}
