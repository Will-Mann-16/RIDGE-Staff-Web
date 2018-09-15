import axios from 'axios';

export var PORT = 8081;
export var HOST_IP = "http://" + "ridge.wellingtoncollege.org.uk" + ":" + PORT;
export var scriptsDirectory = HOST_IP + '/api/';
export var axiosOpen = axios.create({
    baseURL: scriptsDirectory
});
