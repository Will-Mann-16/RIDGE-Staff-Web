import axios from 'axios';

//export const HOST_IP = "http://localhost:8080";
//export const HOST_IP = 'https://ridge-wellington-server.azurewebsites.net';
export const HOST_IP = "http://10.11.0.23:8081";
export const scriptsDirectory = HOST_IP + '/api/';

export const axiosToken = axios.create({
  baseURL: scriptsDirectory,
  headers: { 'X-Access-Token': localStorage.getItem('RIDGE-AUTH-TOKEN') }
});

export const axiosOpen = axios.create({
  baseURL: scriptsDirectory
});
