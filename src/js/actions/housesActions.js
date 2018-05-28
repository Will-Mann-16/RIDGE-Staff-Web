/*jshint esversion: 6 */
import {emit} from './../socket.js';
import {axiosOpen} from '../constants';

export function createHouse(house) {
    return dispatch => {
        dispatch({type: 'CREATE_HOUSE'});
        axiosOpen
            .post('houses/create', {house: house}, {headers: {'X-Access-Token': localStorage.getItem('RIDGE-AUTH-TOKEN')}})
            .then(response => {
                if (response.data.success) {
                    dispatch(readHouses(house._id));
                    dispatch({
                        type: 'CREATE_HOUSE_FULFILLED',
                        payload: response.data.success
                    });
                } else {
                    dispatch({
                        type: 'CREATE_HOUSE_REJECTED',
                        payload: response.data.reason
                    });
                }
            })
            .catch(err => {
                dispatch({type: 'CREATE_HOUSE_REJECTED', payload: err});
            });
    };
}

export function readHouses(house) {
    return dispatch => {
        dispatch({type: 'READ_HOUSES'});
        axiosOpen
            .get('houses/read', {
                params: {house: house},
                headers: {'X-Access-Token': localStorage.getItem('RIDGE-AUTH-TOKEN')}
            })
            .then(response => {
                if (response.status === 200 && response.data.success) {
                    dispatch({
                        type: 'READ_HOUSES_FULFILLED',
                        payload: response.data.houses
                    });
                } else {
                    dispatch({
                        type: 'READ_HOUSES_REJECTED',
                        payload: response.data.reason
                    });
                }
            })
            .catch(err => {
                dispatch({type: 'READ_HOUSES_REJECTED', payload: err});
            });
    };
}

export function updateHouse(id, house) {
    return dispatch => {
        dispatch({type: 'UPDATE_HOUSE'});
        axiosOpen
            .post('houses/update', {
                id: id,
                house: house
            }, {headers: {'X-Access-Token': localStorage.getItem('RIDGE-AUTH-TOKEN')}})
            .then(response => {
                if (response.status === 200 && response.data.success) {
                    dispatch(readHouses(id));
                    dispatch({
                        type: 'UPDATE_HOUSE_FULFILLED',
                        payload: response.data.house
                    });
                } else {
                    dispatch({
                        type: 'UPDATE_HOUSE_REJECTED',
                        payload: response.data.reason
                    });
                }
            })
            .catch(err => {
                dispatch({type: 'UPDATE_HOUSE_REJECTED', payload: err});
            });
    };
}

export function deleteHouse(id) {
    return dispatch => {
        dispatch({type: 'DELETE_HOUSE'});
        axiosOpen
            .get('houses/delete', {
                params: {id: id},
                headers: {'X-Access-Token': localStorage.getItem('RIDGE-AUTH-TOKEN')}
            })
            .then(response => {
                if (response.status === 200 && response.data.success) {
                    dispatch(readHouses());
                    dispatch({
                        type: 'DELETE_HOUSE_FULFILLED',
                        payload: response.data.success
                    });
                } else {
                    dispatch({
                        type: 'DELETE_HOUSE_REJECTED',
                        payload: response.data.reason
                    });
                }
            })
            .catch(err => {
                dispatch({type: 'DELETE_HOUSE_REJECTED', payload: err});
            });
    };
}

export function modifyHouseConfig(house, config) {
    return dispatch => {
        dispatch({type: 'MODIFY_CONFIG_HOUSE'});
        axiosOpen
            .post('houses/update-config', {
                house: house,
                config: config
            }, {headers: {'X-Access-Token': localStorage.getItem('RIDGE-AUTH-TOKEN')}})
            .then(response => {
                if (response.status === 200 && response.data.success) {
                    dispatch(readHouses(house));
                    dispatch({
                        type: 'MODIFY_CONFIG_HOUSE_FULFILLED',
                        payload: response.data.house
                    });
                } else {
                    dispatch({
                        type: 'MODIFY_CONFIG_HOUSE_REJECTED',
                        payload: response.data.reason
                    });
                }
            })
            .catch(err => {
                dispatch({type: 'MODIFY_CONFIG_HOUSE_REJECTED', payload: err});
            });
    };
}
