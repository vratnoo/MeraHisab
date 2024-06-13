import { useState } from "react";
import { View,Text,Image,FlatList } from "react-native";
import { Button,TextInput } from "react-native-paper";

const App = ()=>{
  const [count,setCount] = useState(0)
  const [name,setName] = useState("")
  const data = [{name:'vikram',_class:1},
                {name:'Ram',_class:2},
                {name:'shyam',_class:3},
                {name:'geeta ',_class:4},
                {name:'Seeta',_class:1},
  ]
  return (
    <View>
      <FlatList data={data} renderItem={({item})=>{
        return(
          <View>
          {/* <Image source={require('./assets/images/karni.JPG')}/> */}
          <Image source={{uri: 'https://reactjs.org/logo-og.png'}} style={{ width: 100, height: 100,position:'absolute',zIndex:-100 }} />
          <Text style={{color:'red'}}> {item.name}</Text>
          <Button   onPress={() => setCount(count + 1)}>Press Me</Button>
          <TextInput onChangeText={(newText)=>setName(newText)}/>
        </View>
        )
      }}/>
  

    </View>
  )
}

export default App