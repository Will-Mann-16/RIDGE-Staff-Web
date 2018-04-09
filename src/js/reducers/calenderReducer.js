export default function reducer(state={
  events: [],
  fetching: false,
  fetched: false,
  error: null
}, action){
  switch(action.type){
    case "CREATE_CALENDER":
      return {...state, fetching: true, fetched: false};
    case "CREATE_CALENDER_REJECTED":
      return {...state, fetching: false, error: action.payload};
    case "CREATE_CALENDER_FULFILLED":
      return {...state, fetching: false, fetched: true};

    case "READ_CALENDER":
      return {...state, fetching: true, fetched: false};
    case "READ_CALENDER_REJECTED":
      return {...state, fetching: false, error: action.payload};
    case "READ_CALENDER_FULFILLED":
      return {...state, fetching: false, fetched: true, events: action.payload};

    case "UPDATE_CALENDER":
      return {...state, fetching: true, fetched: false};
    case "UPDATE_CALENDER_REJECTED":
      return {...state, fetching: false, error: action.payload};
    case "UPDATE_CALENDER_FULFILLED":
      return {...state, fetching: false, fetched: true};

    case "DELETE_CALENDER":
      return {...state, fetching: true, fetched: false};
    case "DELETE_CALENDER_REJECTED":
      return {...state, fetching: false, error: action.payload};
    case "DELETE_CALENDER_FULFILLED":
      return {...state, fetching: false, fetched: true};

      default:
      return state;
  }
}
