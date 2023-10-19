// GoalContext.js
import React, { createContext, useContext, useReducer } from 'react';

const GoalContext = createContext();

const initialState = {
  goals: [], // Your goals data
};

const goalReducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_GOAL':
      // Update the goal in state and return a new state
      // ...
      return newState;
    default:
      return state;
  }
};

export const GoalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(goalReducer, initialState);

  const updateGoal = (updatedGoalData) => {
    dispatch({ type: 'UPDATE_GOAL', payload: updatedGoalData });
  };

  return (
    <GoalContext.Provider value={{ state, updateGoal }}>
      {children}
    </GoalContext.Provider>
  );
};

export const useGoalContext = () => {
  return useContext(GoalContext);
};
