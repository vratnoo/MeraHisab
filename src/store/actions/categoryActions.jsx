import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth'


// action creator
export const categoryLoading = ()=>{
    return {
        type: "categories/categoryLoading",
    };
}

export const categoryLoaded = (categories)=>{
    return {
        type: "categories/categoryLoaded",
        payload: categories,
    };
}
export const categoryAdd = (category)=>{
    return {
        type:'categories/categoryAdd',
        payload:category
    }
}

export const categoryUpdate = (category)=>{
    return {
        type:'categories/categoryUpdate',
        payload:category
    }
}

export const categoryDelete = (categoryId)=>{
    return {
        type:'categories/categoryDelete',
        payload:categoryId
    }
}

// selector
export const fetchCategories = (state)=>{
    return state.categories.entities
}


// // thunks
// export const fetchCategoriesThunk = ()=>{
//     return async (dispatch)=>{
//         dispatch(categoryLoading())
//         const user = 
//         const categoriesCol = collection(firestore,'CATEGORIES');
//         const response = await getDocs(categoriesCol);
//         const categories = response.docs.map(doc=>doc.data());
//         dispatch(categoryLoaded(categories))
//     }
// }


// export const fetchTransactionThunk = ()=> async (dispatch)=>{
//     dispatch(transactionLoading())
//     const user = auth().currentUser
//     const transactionList = []
//     const querySnapshot = await firestore().collection('TRANSACTIONS').where('uid','==',user.uid).get();
//     querySnapshot.forEach((doc) => {
//       // doc.data() is never undefined for query doc snapshots
//       transactionList.push(doc.data())
//     });
//     await console.log("fetched transactionlist is here ",transactionList)
//     dispatch(transactionLoaded(transactionList))

// }

export const addCategoryThunk = (data)=>async (dispatch)=>{
    dispatch(categoryLoading())
    const user = auth().currentUser
  try {
      // Get a reference to a new document with an auto-generated ID
      const docRef = await firestore().collection('CATEGORIES').doc();
  
      // Set the document data using the document ID
      await docRef.set({
        ...data,
        id: docRef.id,
        uid: user.uid,
      });
  
      console.log('CATEGORY added!');
      // dispatch(memberAdded({ id: docRef.id, ...data }));
      dispatch(categoryAdd({...data,id:docRef.id}))
    } catch (error) {
      console.error('Error adding Category:', error);
    }

}

export const fetchCategoriesThunk = ()=> async (dispatch)=>{
    dispatch(categoryLoading())
    const user = auth().currentUser
    const categoriesList = []
    const querySnapshot = await firestore().collection('CATEGORIES').where('uid','==',user.uid).get();
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      categoriesList.push(doc.data())
    });
    await console.log("fetched categorieslist is here ",categoriesList)
    dispatch(categoryLoaded(categoriesList))

}

export const updateCategoryThunk = (category)=>{
    return async (dispatch)=>{
         try {
            const docRef = await firestore().collection('CATEGORIES').doc(category.id);
            await docRef.update(category);
  
         } catch (error) {
            console.error('Error updating Category:', error);
            
         }
        dispatch(categoryLoading())
        dispatch(categoryUpdate(category))
    }
}

export const deleteCategoryThunk = (categoryId)=>{
    return async (dispatch)=>{
        dispatch(categoryLoading())
        const docRef = firestore().collection('CATEGORIES').doc(categoryId);
        await docRef.delete();
        dispatch(categoryDelete(categoryId))
    }
}