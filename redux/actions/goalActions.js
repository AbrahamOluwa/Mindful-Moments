export const UPDATE_GOAL = 'UPDATE_GOAL';
export const ADD_GOAL = 'ADD_GOAL';
export const DELETE_GOAL = 'DELETE_GOAL';


export const updateGoalAction = (goalId, updatedData) => {
    return {
      type: UPDATE_GOAL,
      payload: {
        goalId,
        updatedData,
      },
    };
  };
  
  // Action creator to add a new goal
  export const addGoalsAction = (newGoalData) => {
    return {
      type: ADD_GOAL,
      payload: newGoalData,
    };
  };


  export const deleteGoal = (goalId) => {
    return {
      type: DELETE_GOAL,
      payload: goalId,
    };
  };

  