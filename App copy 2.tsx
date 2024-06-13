import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View,Text } from "react-native";
import { Button } from "react-native-paper";

const Stack = createNativeStackNavigator()
const App = ()=>{

  return(
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
        name="home"
        component={Home}
        options={{title:'welcome'}}
        />
        <Stack.Screen
        name="profile"
        component={Profile}
        options={{title:'Profile'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}


const Home  = ({navigation})=>{
  return(
    <View>
      <Text>
        Vikram this is working.
      </Text>
      <Button onPress={()=>navigation.navigate('profile',{name:'vikram'})}>profile here </Button>
      <Button onPress={()=>navigation.navigate('profile',{name:'ram'})}>profile here </Button>
      <Button onPress={()=>navigation.navigate('profile',{name:'shyam'})}>profile here </Button>
    </View>
  )
}

const Profile = ({navigation,route})=>{
  return(
    <View>
      <Text>
        Profile here {route.params.name}
      </Text>
    </View>
  )
}
export default App