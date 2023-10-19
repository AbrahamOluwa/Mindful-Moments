import { createStore, combineReducers } from 'redux';
import goalReducer from './reducers/goalReducer'; // Import your goal reducer here

// Combine reducers if you have multiple reducers
const rootReducer = combineReducers({
  goal: goalReducer, // Assign your goal reducer to the 'goal' state slice
  // Add more reducers here if needed
});

const store = createStore(rootReducer);

export default store;