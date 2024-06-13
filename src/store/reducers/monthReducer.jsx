
const initialState = {
  selectedMonth: new Date().toISOString(),
  // other initial states
};

export const monthReducer = (state = initialState.selectedMonth, action) => {
  switch (action.type) {
    case SET_SELECTED_MONTH:
      return action.payload;
    default:
      return state;
  }
};


// actions
export const SET_SELECTED_MONTH = 'SET_SELECTED_MONTH';

export const setSelectedMonth = (date) => ({
  type: SET_SELECTED_MONTH,
  payload: new Date(date).toISOString(),
});