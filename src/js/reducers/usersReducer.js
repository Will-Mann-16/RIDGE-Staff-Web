export default function reducer(
  state = {
    user: {},
    fetching: false,
    fetched: false,
    authenticated: false,
    error: null,
    config: {},
    login: {
      fetched: false,
      fetching: false,
      authenticated: false
    }
  },
  action
) {
  switch (action.type) {
    case 'CREATE_USER':
      return { ...state, fetching: true, fetched: false };
    case 'CREATE_USER_REJECTED':
      return {
        ...state,
        fetching: false,
        fetched: true,
        error: action.payload
      };
    case 'CREATE_USER_FULFILLED':
      return { ...state, fetching: false, fetched: true };

    case 'READ_USER':
      return { ...state, fetching: true, fetched: false };
    case 'READ_USER_FULFILLED':
      return {
        ...state,
        fetching: false,
        fetched: true,
        user: action.payload.user,
        config: action.payload.config,
        authenticated: true
      };
    case 'READ_USER_EMPTY':
      return {
        ...state,
        fetching: false,
        fetched: true,
        user: {},
        authenticated: false
      };
    case 'READ_USER_REJECTED':
      return {
        ...state,
        fetching: false,
        fetched: true,
        error: action.payload
      };

    case 'UPDATE_USER':
      return { ...state, fetching: true, fetched: false };
    case 'UPDATE_USER_REJECTED':
      return {
        ...state,
        fetching: false,
        fetched: true,
        error: action.payload
      };
    case 'UPDATE_USER_FULFILLED':
      return { ...state, fetching: false, fetched: true, user: action.payload };

    case 'DELETE_USER':
      return { ...state, fetching: true, fetched: false };
    case 'DELETE_USER_REJECTED':
      return {
        ...state,
        fetching: false,
        fetched: true,
        error: action.payload
      };
    case 'DELETE_USER_FULFILLED':
      return { ...state, fetching: false, fetched: true };

    case 'AUTHENTICATE_USER':
      return { ...state, login:{...state.login, fetching: true, fetched: false }};
    case 'AUTHENTICATE_USER_FULFILLED':
      return { ...state, login:{...state.login, fetching: false, fetched: true }};
    case 'AUTHENTICATE_USER_DENIED':
      return { ...state, login:{...state.login, fetching: false, fetched: true }};
    case 'AUTHENTICATE_USER_REJECTED':
      return { ...state, login: {...state.login, fetching: false}, error: action.payload };

    case 'LOGOUT_USER':
      return { ...state, fetching: true, fetched: false };
    case 'LOGON_USER_FULFILLED':
      return { ...state, fetching: false, user: {}, authenticated: false };
    case 'LOGON_USER_REJECTED':
      return { ...state, fetching: false, error: action.payload };

    case 'CHANGE_HOUSE_USER':
      return {
        ...state,
        user: {
          ...state.user,
          data: { ...state.user.data, house: action.payload }
        }
      };
    case 'SET_CONFIG':
      return { ...state, fetching: true, fetched: false };
    case 'SET_CONFIG_REJECTED':
      return {
        ...state,
        fetching: false,
        fetched: true,
        config: action.payload
      };
    case 'SET_CONFIG_FULFILLED':
      return { ...state, fetching: false, error: action.payload };
    default:
      return state;
  }
}
