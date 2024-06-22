import { transType } from "./transactionReducer";

const initialState = {
  entities: [
    { id: '1', name: "Food", type: transType.EXPENSE, parentId: null, isSubcategory: false },
    { id: '2', name: "Bills", type: transType.EXPENSE, parentId: null, isSubcategory: false },
    { id: '3', name: "Transport", type: transType.EXPENSE, parentId: null, isSubcategory: false },
    { id: '4', name: "Salary", type: transType.INCOME, parentId: null, isSubcategory: false },
    // Example subcategory
    { id: '5', name: "Groceries", type: transType.EXPENSE, parentId: '1', isSubcategory: true }
  ]
};

export const categoryReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'categories/categoryLoading': {
      return { ...state, status: 'loading' };
    }
    case 'categories/categoryLoaded': {
      return { ...state, status: 'idle', entities: action.payload };
    }
    case 'categories/categoryAdd': {
      return { ...state, status: 'idle', entities: [...state.entities, action.payload] };
    }
    case 'categories/categoryUpdate': {
      const updatedCategory = action.payload;
      return {
        ...state,
        status: 'idle',
        entities: state.entities.map((item) =>
          item.id === updatedCategory.id ? updatedCategory : item
        )
      };
    }
    case 'categories/categoryDelete': {
      const deletedCategoryId = action.payload;
      return {
        ...state,
        status: 'idle',
        entities: state.entities.filter((item) => item.id !== deletedCategoryId)
      };
    }
    default: {
      return state;
    }
  }
};
