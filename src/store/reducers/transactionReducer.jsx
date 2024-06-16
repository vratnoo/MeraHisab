// import { collection, addDoc, doc,getDocs,setDoc,deleteDoc,updateDoc } from "firebase/firestore/lite";
// import { firestore } from "../../firebase";
import { todayDate } from "../../helper/utility";

export const transType = {
    INCOME:'income',
    EXPENSE:'expense',
    TRANSFER:'transfer'
}


const initailState = {
  status:'idle',
  entities: [
    {
      id: Date.now().toString(),
      type: transType.INCOME,
      date: new Date().toISOString(),
      amount: 3000,
      accountId: 1,
      categoryId: '3',
      notes: "dummy",
      desc: "xyz",
    },
  ],
};

export function transactionReducer(state = initailState, action) {
  switch (action.type) {
    case "transaction/transactionLoaded": {
      return {...state,entities:action.payload,status:'idle'};
    }
    case "transaction/transactionLoading": {
      return {...state,status:'loading'};
    }
    case "transaction/transactionAdded": {
      return {...state,entities:[...state.entities,action.payload],status:'idle'};
    }
    case "transaction/transactionUpdate": {
      const updatedTransaction = action.payload
      return {...state,status:'idle',entities:state.entities.map(item=>item.id===updatedTransaction.id?updatedTransaction:item)};
    }
    case "transaction/transactionDelete": {
      const deletedTransactionId = action.payload
      return {...state,status:'idle',entities:state.entities.filter(item=>item.id!==deletedTransactionId)};
    }

    default:{
        return state
    }
  }
}


