import { createSelector } from 'reselect';

const selectGoals = (state) => state.goal; // Assuming your goals are stored under 'goal' state slice

export const selectAllGoals = createSelector(
  [selectGoals],
  (goals) => goals
);

export const selectGoalsByCategory = (category) =>
  createSelector(
    [selectGoals],
    (goals) => goals.filter((goal) => goal.category === category)
  );