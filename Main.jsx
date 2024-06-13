import { useEffect } from "react"
import AppNavigator from "./src/navigation/AppNavigator"
import GoogleSignIn from "./src/screens/CustomLogin"
import auth from "@react-native-firebase/auth"
import { useDispatch, useSelector } from "react-redux"
import { loginFailure, loginSuccess, logout } from "./src/store/actions/authActions"


const Main = ()=>{
  const authState = useSelector(state=>state.auth)
  const dispatch = useDispatch()

  useEffect(()=>{
     
    const unsubscribe = auth().onAuthStateChanged(async (user)=>{
      console.log("user is here ",user)
      if(user){
          dispatch(loginSuccess(user))
      }else{
        dispatch(logout())
      }
    })

    return ()=>{unsubscribe()}

  },[dispatch])

  useEffect(() => {
    console.log("Updated auth state:", authState);
  }, [authState]);

  if(authState.loading){
    return <Text>Loading... app</Text>
  }

  if(authState.user){
    return(
      <AppNavigator/>
    )

  }



  return (
    <GoogleSignIn/>
  )
  
}

export default Main