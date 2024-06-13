
// import { doc,getDocs,collection,setDoc,updateDoc,deleteDoc } from "firebase/firestore/lite"
// import { firestore } from "../../firebase"
import { transType } from "./transactionReducer"

const initailState = {
    entities:[
        {id:1,name:"cash"},
        {id:2,name:"Online"},
    ]
      
}


export const accountReducer = (state=initailState,action)=>{

    switch(action.type){
        case 'accounts/accountsLoading':{
            return {...state,status:'loading'}
        }
        case 'accounts/accountsLoaded':{
            return {...state,status:'idle',entities:action.payload}
        }
        case 'accounts/accountsAdd':{
            return {...state,status:'idle',entities:[...state.entities,action.payload]}
        }
        case 'accounts/accountsUpdate':{
            const updatedAccount = action.payload
            return {...state,status:'idle',entities:state.entities.map((item)=>item.id === updatedAccount.id?updatedAccount:item )}
        }

        case 'accounts/accountsDelete':{
            const deletedAccountId = action.payload
            return {...state,status:'idle',entities:state.entities.filter((item)=>item.id !== deletedAccountId)}
        }
        default:{
            return state
        }
    }
}



// selector
export const fetchAccounts = (state)=>{
    return state.accounts.entities
}


// // thunks
// export const fetchCategoriesThunk = ()=>{
//     return async (dispatch)=>{
//         dispatch(categoryLoading())
//         const categoriesCol = collection(firestore,'CATEGORIES');
//         const response = await getDocs(categoriesCol);
//         const categories = response.docs.map(doc=>doc.data());
//         dispatch(categoryLoaded(categories))
//     }
// }

// export const addCategoryThunk = (category)=>{
//     return async (dispatch)=>{
//         dispatch(categoryLoading())
//         const categoriesRef = doc(collection(firestore,'CATEGORIES'))
//         await setDoc(categoriesRef,{...category,id:categoriesRef.id})
//         dispatch(categoryAdd({...category,id:categoriesRef.id}))
//     }
// }

// export const updateCategoryThunk = (category)=>{
//     return async (dispatch)=>{
//         dispatch(categoryLoading())
//         const categoriesRef = doc(collection(firestore,'CATEGORIES'),category.id)
//         await updateDoc(categoriesRef,category)
//         dispatch(categoryUpdate(category))
//     }
// }

// export const deleteCategoryThunk = (categoryId)=>{
//     return async (dispatch)=>{
//         dispatch(categoryLoading())
//         const categoriesRef = doc(collection(firestore,'CATEGORIES'),categoryId)
//         await deleteDoc(categoriesRef)
//         dispatch(categoryDelete(categoryId))
//     }
// }