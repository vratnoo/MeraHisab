import React, { useEffect, useState } from "react";
import { View,Text } from "react-native";
import AppNavigator from './src/navigation/AppNavigator'
import { SafeAreaProvider } from "react-native-safe-area-context";
import { PaperProvider } from "react-native-paper";
import { Provider } from "react-redux";
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './src/store';

import auth from '@react-native-firebase/auth';
import Main from "./Main";
import {
  GoogleSignin
} from '@react-native-google-signin/google-signin';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
const App  = ()=>{

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '82713197254-e0hnnvabnqgh8fh9dpp5h6p3bkbogaqv.apps.googleusercontent.com',
    });
  }, []);

  return(
    <GestureHandlerRootView style={{flex:1}} >
    <Provider store={store}>
       <PersistGate loading={<Text>Loading...</Text>} persistor={persistor}>

              <PaperProvider>
                  <Main/>
              </PaperProvider>

               
       </PersistGate>
    </Provider>
    </GestureHandlerRootView>



)
}







  

export default App
