import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth'

// action creator
export function transactionLoaded(transactions) {
    return {
      type: "transaction/transactionLoaded",
      payload: transactions,
    };
  }
  const transactionLoading = ()=>{
    return {
      type: "transaction/transactionLoading",
    };
  }

  export  const transactionAdd = (data)=>{
      
      return{
          type:'transaction/transactionAdded',
          payload:data
      }
  }
  
  export const transactionDelete =  (transactionId)=>{
    return{
      type:'transaction/transactionDelete',
      payload:transactionId
    }
  }
  
  export const transactionUpdate = (data)=>{
    return{
      type:'transaction/transactionUpdate',
      payload:data
    }
  }
  
  // selectors
  export const fetchTransaction = (state)=>{
    return state.transactions.entities
  
  }
  
  // // thunk function 
  
  export const fetchTransactionThunk = ()=> async (dispatch)=>{
      dispatch(transactionLoading())
      const user = auth().currentUser
      const transactionList = []
      const querySnapshot = await firestore().collection('TRANSACTIONS').where('uid','==',user.uid).get();
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        transactionList.push(doc.data())
      });
      await console.log("fetched transactionlist is here ",transactionList)
      dispatch(transactionLoaded(transactionList))
  
  }
  
  export const addTransactionThunk = (data)=>async (dispatch)=>{
        dispatch(transactionLoading())
        const user = auth().currentUser
      try {
          // Get a reference to a new document with an auto-generated ID
          const docRef = await firestore().collection('TRANSACTIONS').doc();
      
          // Set the document data using the document ID
          await docRef.set({
            ...data,
            id: docRef.id,
            uid: user.uid,
          });
      
          console.log('TRANSACTION added!');
          // dispatch(memberAdded({ id: docRef.id, ...data }));
          dispatch(transactionAdd({...data,id:docRef.id}))
        } catch (error) {
          console.error('Error adding Transaction:', error);
        }

  }
  
  export const updateTransactionThunk = (data)=>async (dispatch,getState)=>{
      dispatch(transactionLoading())

      try {
        const docRef = await firestore().collection('TRANSACTIONS').doc(data.id);
        await docRef.update(data);
      } catch (error) {
        console.error('Error updating Transaction:', error);
      }
      dispatch(transactionUpdate(data))
  }
  
  export const deleteTransactionThunk = (transactionId)=>async (dispatch,getState)=>{
    dispatch(transactionLoading())
     try {
        const docRef = await firestore().collection('TRANSACTIONS').doc(transactionId);
        await docRef.delete();
        console.log('Transaction deleted!');
     } catch (error) {
        console.error('Error deleting Transaction:', error);
     }
    dispatch(transactionDelete(transactionId))
  
  }