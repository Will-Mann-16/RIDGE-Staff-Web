import React, { Component } from 'react';
import { Provider } from 'react-redux';
import AppLayout from './js/components/AppLayout';
import store from './js/store';
class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <AppLayout />
      </Provider>
    );
  }
}

export default App;
