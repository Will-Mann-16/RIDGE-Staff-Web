/*jshint esversion: 6 */
import { emit } from "./../socket.js";
import { axiosToken } from "../constants";
import {readCallovers} from "./calloverActions";
export function createCalender(event, house){
    return dispatch => {
        dispatch({type: "CREATE_CALENDER"});
        axiosToken.post("calender/create", { house: house, event: event }).then((response) =>{
            if(response.data.success){
                dispatch(readCalender());
                dispatch({type: "CREATE_CALENDER_FULFILLED", payload: response.data.success});
            }
            else{
                dispatch({type: "CREATE_CALENDER_REJECTED", payload: response.data.reason});
            }
        }).catch((err) => {
            dispatch({type: "CREATE_CALENDER_REJECTED", payload: err});
        });
    };
}
export function readCalender(house){
    return dispatch => {
        dispatch({type: "READ_CALENDER"});
        axiosToken.get("calender/read", {params: {house: house}}).then((response) =>{
            if(response.status === 200 && response.data.success){
                dispatch({type: "READ_CALENDER_FULFILLED", payload: response.data.events});
            }
            else{
                dispatch({type: "READ_CALENDER_REJECTED", payload: response.data.reason});
            }
        }).catch((err) =>{
            dispatch({type: "READ_CALENDER_REJECTED", payload: err});
        });
    };
}


export function updateCalender(id, event, house){
    return dispatch => {
        dispatch({type: "UPDATE_CALENDER"});
        axiosToken.post("calender/update",  { id: id, event: event, house: house }).then((response) =>{
            if(response.status === 200 && response.data.success){
                dispatch(readCalender());
                dispatch({type: "UPDATE_CALENDER_FULFILLED", payload: response.data.event});
            }
            else{
                dispatch({type: "UPDATE_CALENDER_REJECTED", payload: response.data.reason});
            }
        }).catch((err) =>{
            dispatch({type: "UPDATE_CALENDER_REJECTED", payload: err});
        });
    };
}

export function deleteCalender(id, house){
    return dispatch => {
        dispatch({type: "DELETE_CALENDER"});
        axiosToken.get("calender/delete",  {params: { id: id, house }}).then((response) =>{
            if(response.status === 200 && response.data.success){
                dispatch(readCalender());
                dispatch({type: "DELETE_CALENDER_FULFILLED", payload: response.data.success});
            }
            else{
                dispatch({type: "DELETE_CALENDER_REJECTED", payload: response.data.reason});
            }
        }).catch((err) =>{
            dispatch({type: "DELETE_CALENDER_REJECTED", payload: err});
        });
    };
}
