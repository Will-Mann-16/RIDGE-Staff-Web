import * as studentsActions from './actions/studentsActions';
import * as locationsActions from './actions/locationsActions';
import io from "socket.io-client";
import {HOST_IP} from "./constants";

var socket;
export var connected = false;

export function activateListener(dispatch, house) {

  if (!connected) {
    socket = io.connect(HOST_IP);
    socket.on('connect', () => {
      connected = true;
      socket.emit('socket-client-server-init', {
        house: house
      });
      socket.on('socket-server-client-init', function () {
        socket.on('socket-server-client-redraw-minor', response => {
          if (house === response.house) {
            dispatch(studentsActions.readStudentsMinor(house));
          }
        });
        socket.on('socket-server-client-redraw-major', response => {
          if (house === response.house) {
            dispatch(studentsActions.readStudentsMajor(house));
            dispatch(locationsActions.readLocations(house));
          }
        });
      });
    });
  }
}

export function emit(value, packet = {}) {
  if (connected) {
    socket.emit(value, packet);
  }
}

export function disconnect(){
  if(connected){
    socket.disconnect();
  }
}