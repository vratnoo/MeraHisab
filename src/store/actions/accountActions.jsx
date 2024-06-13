import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth'

// action creator
export const accountsLoading = ()=>{
    return {
        type: "accounts/accountsLoading",
    };
}

export const accountsLoaded = (accounts)=>{
    return {
        type: "accounts/accountsLoaded",
        payload: accounts,
    };
}
export const accountsAdd = (account)=>{
    return {
        type:'accounts/accountsAdd',
        payload:account
    }
}

export const accountsUpdate = (account)=>{
    return {
        type:'accounts/accountsUpdate',
        payload:account
    }
}

export const accountsDelete = (accountId)=>{
    return {
        type:'accounts/accountsDelete',
        payload:accountId
    }
}

export const addAccountThunk = (data)=>async (dispatch)=>{
    dispatch(accountsLoading())
    const user = auth().currentUser
  try {
      // Get a reference to a new document with an auto-generated ID
      const docRef = await firestore().collection('ACCOUNTS').doc();
  
      // Set the document data using the document ID
      await docRef.set({
        ...data,
        id: docRef.id,
        uid: user.uid,
      });
  
      console.log('ACCOUNT added!');
      // dispatch(memberAdded({ id: docRef.id, ...data }));
      dispatch(accountsAdd({...data,id:docRef.id}))
    } catch (error) {
      console.error('Error adding Account:', error);
    }

}

export const updateAccountThunk = (data)=>async (dispatch)=>{
    dispatch(accountsLoading())
    try {
      // Get a reference to a new document with an auto-generated ID
      const docRef = await firestore().collection('ACCOUNTS').doc(data.id);
      await docRef.update(data);
    } catch (error) {
      console.error('Error updating Account:', error);
    }
    dispatch(accountsUpdate(data))
}

export const deleteAccountThunk = (accountId)=>async (dispatch)=>{
    dispatch(accountsLoading())
    try {
      // Get a reference to a new document with an auto-generated ID
      const docRef = await firestore().collection('ACCOUNTS').doc(accountId);
      await docRef.delete();
    } catch (error) {
      console.error('Error deleting Account:', error);
    }
    dispatch(accountsDelete(accountId))
}


export const fetchAccountsThunk = ()=> async (dispatch)=>{
    dispatch(accountsLoading())
    const user = auth().currentUser
    const accountList = []
    const querySnapshot = await firestore().collection('ACCOUNTS').where('uid','==',user.uid).get();
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      accountList.push(doc.data())
    });
    await console.log("fetched accountlist is here ",accountList)
    dispatch(accountsLoaded(accountList))

}


