import axios from 'axios';

export var WELLY_IP = "194.73.225.206";
export var INTERNAL_IP = "10.11.0.23";
export var PORT = "8081";
export var HOST_IP = "http://" + INTERNAL_IP + ":" + PORT;
export var scriptsDirectory = HOST_IP + '/api/';
export var axiosOpen = axios.create({
    baseURL: scriptsDirectory
});
