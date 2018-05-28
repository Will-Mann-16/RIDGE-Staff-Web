import {axiosOpen} from '../constants';

export function createCallover(callover, house) {
    return dispatch => {
        dispatch({type: 'CREATE_CALLOVER'});
        axiosOpen
            .post('callover/create', {
                callover: callover,
                house: house
            }, {headers: {'X-Access-Token': localStorage.getItem('RIDGE-AUTH-TOKEN')}})
            .then(response => {
                if (response.status === 200 && response.data.success) {
                    dispatch(readCallovers(house));
                    dispatch({
                        type: 'CREATE_CALLOVER_FULFILLED',
                        payload: response.data.success
                    });
                } else {
                    dispatch({
                        type: 'CREATE_CALLOVER_REJECTED',
                        payload: response.data.reason
                    });
                }
            })
            .catch(err => {
                dispatch({type: 'CREATE_CALLOVER_REJECTED', payload: err});
            });
    };
}

export function readCallovers(house) {
    return dispatch => {
        dispatch({type: 'READ_CALLOVER'});
        axiosOpen
            .get('callover/read', {
                params: {house: house},
                headers: {'X-Access-Token': localStorage.getItem('RIDGE-AUTH-TOKEN')}
            })
            .then(response => {
                if (response.status === 200 && response.data.success) {
                    dispatch({
                        type: 'READ_CALLOVER_FULFILLED',
                        payload: response.data.callovers
                    });
                } else {
                    dispatch({
                        type: 'READ_CALLOVER_REJECTED',
                        payload: response.data.reason
                    });
                }
            })
            .catch(err => {
                dispatch({type: 'READ_CALLOVER_REJECTED', payload: err});
            });
    };
}
