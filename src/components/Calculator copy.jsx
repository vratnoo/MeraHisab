import {View, StyleSheet} from 'react-native';
import React, {useRef,useState, useCallback} from 'react';
import BottomSheet, {BottomSheetView,BottomSheetBackdrop} from '@gorhom/bottom-sheet';
import {BottomSheetFlatList} from '@gorhom/bottom-sheet';
import { Button, Text, TextInput, Provider as PaperProvider, useTheme } from 'react-native-paper';

const CalculatorBottomSheet = ({initial,open, setOpen, setResult}) => {
  const ref = useRef(null);
  const [input, setInput] = useState(initial);
  const theme  =  useTheme()

  const handleSheetChange = useCallback(index => {
    console.log('handleSheetChange', index);

    if (index === -1) {
      setOpen(false);
    }
  });

  const handlePress = (value) => {
    if (value === '=') {
      try {
        setInput(eval(input).toString());
      } catch (e) {
        setInput('Error');
      }
    } else if (value === 'C') {
      setInput('');
    }else if (value === 'DEL') {
      setInput(input.slice(0, -1));
    }else if (value === '✓') {
      try {
        const output = eval(input);
        setInput(output.toString());
        setResult('amount',output)
        ref.current.close()
      } catch (e) {
        setInput('Error');
      }
      
    }
    else {
      setInput((prev) => prev + value);
    }
  };


  const renderBackdrop  = useCallback(
    (props) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.1}
      />
    ),
    []    
  )
  return (
    <BottomSheet
      ref={ref}
      backgroundStyle={{backgroundColor:theme.colors.surface}}
      handleIndicatorStyle={{backgroundColor:theme.colors.primary}}
      onChange={handleSheetChange}
      snapPoints={[450]}
      index={open ? 0 : -1}
      enablePanDownToClose={true}
      backdropComponent = {renderBackdrop}
      >
        <View style={styles.container}>
        <TextInput
          mode="outlined"
          label="Input"
          value={'₹ '+input}
          style={styles.input}
          disabled
          error={input === 'Error'}
          textColor='green'
        />
        <View style={styles.row}>
          {[
             { key: 'AC', value: 'C' },
             { key: '÷', value: '/' },
             { key: 'X', value: '*' },
             { key: 'DEL', value: 'DEL' },
          ].map((item) => (
            <Button key={item.key} mode="contained" onPress={() => handlePress(item.value)} style={styles.button}>{item.key}</Button>
          ))}
        </View>
        <View style={styles.row}>
          {['7', '8', '9', '*'].map((val) => (
            <Button key={val} mode="contained" onPress={() => handlePress(val)} style={styles.button}>{val}</Button>
          ))}
        </View>
        <View style={styles.row}>
          {['4', '5', '6', '-'].map((val) => (
            <Button key={val} mode="contained" onPress={() => handlePress(val)} style={styles.button}>{val}</Button>
          ))}
        </View>
        <View style={styles.row}>
          {['1', '2', '3', '+'].map((val) => (
            <Button key={val} mode="contained" onPress={() => handlePress(val)} style={styles.button}>{val}</Button>
          ))}
        </View>
        <View style={styles.row}>
          {['0', '.', '=','✓'].map((val) => (
            <Button key={val} mode="contained-tonal" onPress={() => handlePress(val)} style={styles.button}>{val}</Button>
          ))}
        </View>
      </View>
    </BottomSheet>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    paddingHorizontal: 20,
  },
  input: {
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  button: {
    flex: 1,
    margin: 5,
  },
});
export default CalculatorBottomSheet;
