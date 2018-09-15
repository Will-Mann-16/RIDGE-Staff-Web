import { applyMiddleware, createStore } from 'redux';

import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import reducer from './reducers';

import history from './history';

const middleware = composeWithDevTools(applyMiddleware(thunk, logger));

export default createStore(reducer, {}, middleware);
