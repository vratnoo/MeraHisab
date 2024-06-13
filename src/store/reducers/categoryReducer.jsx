
// import { doc,getDocs,collection,setDoc,updateDoc,deleteDoc } from "firebase/firestore/lite"
// import { firestore } from "../../firebase"
import { transType } from "./transactionReducer"

const initailState = {
    entities:[
        {id:'1',name:"Food",type:transType.EXPENSE},
        {id:'2',name:"Bills",type:transType.EXPENSE},
        {id:'3',name:"Transport",type:transType.EXPENSE},
        {id:'4',name:"Salary",type:transType.INCOME}
    ]
}


export const categoryReducer = (state=initailState,action)=>{

    switch(action.type){
        case 'categories/categoryLoading':{
            return {...state,status:'loading'}
        }
        case 'categories/categoryLoaded':{
            return {...state,status:'idle',entities:action.payload}
        }
        case 'categories/categoryAdd':{
            return {...state,status:'idle',entities:[...state.entities,action.payload]}
        }
        case 'categories/categoryUpdate':{
            const updatedCategory = action.payload
            return {...state,status:'idle',entities:state.entities.map((item)=>item.id === updatedCategory.id?updatedCategory:item )}
        }

        case 'categories/categoryDelete':{
            const deletedCategoryId = action.payload
            return {...state,status:'idle',entities:state.entities.filter((item)=>item.id !== deletedCategoryId)}
        }
        default:{
            return state
        }
    }
}

