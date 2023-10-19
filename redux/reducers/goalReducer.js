import { UPDATE_GOAL, ADD_GOAL, DELETE_GOAL } from "../actions/goalActions";

const initialState = {
  goals: [],
};

const goalReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_GOAL:
      const { goalId, updatedData } = action.payload;
      // Find the goal with the provided goalId and update its data
      const updatedGoals = state.goals.map((goal) => {
        if (goal.id === goalId) {
          return { ...goal, ...updatedData };
        }
        return goal;
      });

      return {
        ...state,
        goals: updatedGoals,
      };

    case ADD_GOAL:
      const newGoal = action.payload;
      return {
        ...state,
        goals: [...state.goals, newGoal],
      };

      case DELETE_GOAL:
      // Handle deleting a goal by filtering out the goal with the specified goalId
      const goalIdToDelete = action.payload;
      const selectedGoal = state.goals.filter((goal) => goal.id !== goalIdToDelete);
      return { ...state, goals: selectedGoal };

    default:
      return state;
  }
};

export default goalReducer;

// const initialState = [];

// const goalReducer = (state = initialState, action) => {
//   switch (action.type) {
//     case UPDATE_GOAL:
//       const { goalId, updatedData } = action.payload;
//       // Find the goal with the provided goalId and update its data
//       const updatedGoals = state.map((goal) => {
//         if (goal.id === goalId) {
//           return { ...goal, ...updatedData };
//         }
//         return goal;
//       });

//       return updatedGoals;

//     case ADD_GOAL:
//       const newGoal = action.payload;
//       return [...state, newGoal];

//     case DELETE_GOAL:
//       // Handle deleting a goal by filtering out the goal with the specified goalId
//       const goalIdToDelete = action.payload;
//       const selectedGoal = state.filter((goal) => goal.id !== goalIdToDelete);
//       return selectedGoal;

//     default:
//       return state;
//   }
// };

// export default goalReducer;