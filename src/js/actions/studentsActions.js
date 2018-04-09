/*jshint esversion: 6 */
import { emit} from "./../socket.js";
import {axiosToken} from "../constants";
export function selectStudent(id){
  return dispatch => {
    dispatch({type: "SELECT_STUDENT", payload: id});
  }
}
export function deselectStudent(id){
  return dispatch => {
    dispatch({type: "DESELECT_STUDENT", payload: id});
  }
}
export function createStudent(student, house){
  return dispatch => {
    dispatch({type: "CREATE_STUDENT"});
    axiosToken.post("students/create", { student: student, house: house }).then((response) =>{
      if(response.status === 200 && response.data.success){
        dispatch(readStudentsMajor(house));
        emit("socket-client-server-redraw-major");
        dispatch({type: "CREATE_STUDENT_FULFILLED", payload: true});
      }
      else{
        dispatch({type: "CREATE_STUDENT_REJECTED", payload: response.data.reason});
      }
    }).catch((err) =>{
      dispatch({type: "CREATE_STUDENT_REJECTED", payload: err});
    });
  };
}
export function readStudentsMajor(house){
  return dispatch => {
    dispatch({type: "READ_STUDENTS_MAJOR"});
    axiosToken.get("students/read", {params: { house: house }} /*, {
      onDownloadProgress: progressEvent => {
        let percentCompleted = Math.floor((progressEvent.loaded * 100) / progressEvent.total);

    }}*/).then((response) =>{
      if(response.status === 200 && response.data.success){
          dispatch({type: "READ_STUDENTS_MAJOR_FULFILLED", payload: response.data.students});
      }
      else{
          dispatch({type: "READ_STUDENTS_MAJOR_REJECTED", payload: response.data.reason});

      }
    }).catch((err) =>{
      dispatch({type: "READ_STUDENTS_MAJOR_REJECTED", payload: err});
    });
  };
}

export function readStudentsMinor(house){
  return dispatch => {
    dispatch({type: "READ_STUDENTS_MINOR"});
    axiosToken.get("students/read", {params: {house: house, minor: true}}).then((response) =>{
      if(response.status === 200 && response.data.success){
        dispatch({type: "READ_STUDENTS_MINOR_FULFILLED", payload: response.data.students});
      }
      else{
        dispatch({type: "READ_STUDENTS_MINOR_REJECTED", payload: response.data.reason});
      }    }).catch((err) =>{
      dispatch({type: "READ_STUDENTS_MINOR_REJECTED", payload: err});
    });
  };
}



export function updateStudentLocation(ids, location, house){
  return dispatch => {
    dispatch({type: "UPDATE_STUDENT_LOCATION"});
    axiosToken.get("students/update-location",  {params: { ids: ids, location: location, house: house }}).then((response) =>{
      if(response.status === 200 && response.data.success){
        dispatch(readStudentsMinor(house));
        emit("socket-client-server-redraw-minor");
        dispatch({type: "UPDATE_STUDENT_LOCATION_FULFILLED", payload: response.data.students});
      }
      else{
        dispatch({type: "UPDATE_STUDENT_LOCATION_REJECTED", payload: response.data.reason});
      }
    }).catch((err) =>{
      dispatch({type: "UPDATE_STUDENT_LOCATION_REJECTED", payload: err});
    });
  };
}

export function updateStudent(id, student, house){
  return dispatch => {
    dispatch({type: "UPDATE_STUDENT"});
    axiosToken.post("students/update", { id: id, student: student, house: house }).then((response) =>{
      if(response.status === 200 && response.data.success){
          dispatch(readStudentsMajor(house));
          emit("socket-client-server-redraw-major");
        dispatch({type: "UPDATE_STUDENT_FULFILLED", payload: response.data.student});
      }
      else{
        dispatch({type: "UPDATE_STUDENT_REJECTED", payload: response.data.reason});
      }
    }).catch((err) =>{
      dispatch({type: "UPDATE_STUDENT_REJECTED", payload: err});
    });
  };
}

export function deleteStudent(id, house){
  return dispatch => {
    dispatch({type: "DELETE_STUDENT"});
    axiosToken.get("students/delete",  {params: { id: id, house: house}}).then((response) =>{
      if(response.status === 200 && response.data.success){
        emit("socket-client-server-redraw-minor");
        dispatch({type: "DELETE_STUDENT_FULFILLED", payload: response.data.success});
      }
      else{
        dispatch({type: "DELETE_STUDENT_REJECTED", payload: response.data.reason});
      }
    }).catch((err) =>{
      dispatch({type: "DELETE_STUDENT_REJECTED", payload: err});
    });
  };
}

export function uploadStudents(json,house){
  return dispatch => {
    dispatch({type: "UPLOAD_STUDENTS"});
    axiosToken.post("students/upload", { json: json , house: house}).then((response) =>{
      if(response.status === 200 && response.data.success){
          dispatch(readStudentsMajor(house));
          emit("socket-client-server-redraw-major");
        dispatch({type: "UPLOAD_STUDENTS_FULFILLED", payload: response.data.success});
      }
      else{
        dispatch({type: "UPLOAD_STUDENTS_REJECTED", payload: response.data.reason});
      }
    }).catch((err) =>{
      dispatch({type: "UPLOAD_STUDENTS_REJECTED", payload: err});
    });
  }
}
