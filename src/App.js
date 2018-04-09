import React, { Component } from 'react';
import { Provider } from "react-redux";
import App from "./js/components/App";
import store from "./js/store";
import nHistory from './js/history';
import "./css/main.css";
class TopApp extends Component {
  render() {
    return (
    <Provider store={store}>
        <App history={nHistory}/>
    </Provider>
    );
  }
}

export default TopApp;
