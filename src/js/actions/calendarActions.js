/*jshint esversion: 6 */
import {emit} from './../socket.js';
import {axiosOpen} from '../constants';
import {readCallovers} from './calloverActions';

export function createCalendar(event, house) {
    return dispatch => {
        dispatch({type: 'CREATE_CALENDAR'});
        axiosOpen
            .post('calendar/create', {
                house: house,
                event: event
            }, {headers: {'X-Access-Token': localStorage.getItem('RIDGE-AUTH-TOKEN')}})
            .then(response => {
                if (response.data.success) {
                    dispatch(readCalendar());
                    dispatch({
                        type: 'CREATE_CALENDAR_FULFILLED',
                        payload: response.data.success
                    });
                } else {
                    dispatch({
                        type: 'CREATE_CALENDAR_REJECTED',
                        payload: response.data.reason
                    });
                }
            })
            .catch(err => {
                dispatch({type: 'CREATE_CALENDAR_REJECTED', payload: err});
            });
    };
}

export function readCalendar(house) {
    return dispatch => {
        dispatch({type: 'READ_CALENDAR'});
        axiosOpen
            .get('calendar/read', {
                params: {house: house},
                headers: {'X-Access-Token': localStorage.getItem('RIDGE-AUTH-TOKEN')}
            })
            .then(response => {
                if (response.status === 200 && response.data.success) {
                    dispatch({
                        type: 'READ_CALENDAR_FULFILLED',
                        payload: response.data.events
                    });
                } else {
                    dispatch({
                        type: 'READ_CALENDAR_REJECTED',
                        payload: response.data.reason
                    });
                }
            })
            .catch(err => {
                dispatch({type: 'READ_CALENDAR_REJECTED', payload: err});
            });
    };
}

export function updateCalendar(id, event, house) {
    return dispatch => {
        dispatch({type: 'UPDATE_CALENDAR'});
        axiosOpen
            .post('calendar/update', {
                id: id,
                event: event,
                house: house
            }, {headers: {'X-Access-Token': localStorage.getItem('RIDGE-AUTH-TOKEN')}})
            .then(response => {
                if (response.status === 200 && response.data.success) {
                    dispatch(readCalendar());
                    dispatch({
                        type: 'UPDATE_CALENDAR_FULFILLED',
                        payload: response.data.event
                    });
                } else {
                    dispatch({
                        type: 'UPDATE_CALENDAR_REJECTED',
                        payload: response.data.reason
                    });
                }
            })
            .catch(err => {
                dispatch({type: 'UPDATE_CALENDAR_REJECTED', payload: err});
            });
    };
}

export function deleteCalendar(id, house) {
    return dispatch => {
        dispatch({type: 'DELETE_CALENDAR'});
        axiosOpen
            .get('calendar/delete', {
                params: {id: id, house},
                headers: {'X-Access-Token': localStorage.getItem('RIDGE-AUTH-TOKEN')}
            })
            .then(response => {
                if (response.status === 200 && response.data.success) {
                    dispatch(readCalendar());
                    dispatch({
                        type: 'DELETE_CALENDAR_FULFILLED',
                        payload: response.data.success
                    });
                } else {
                    dispatch({
                        type: 'DELETE_CALENDAR_REJECTED',
                        payload: response.data.reason
                    });
                }
            })
            .catch(err => {
                dispatch({type: 'DELETE_CALENDAR_REJECTED', payload: err});
            });
    };
}
