import { View, StyleSheet } from 'react-native';
import React, { useRef, useState, useCallback, memo } from 'react';
import BottomSheet, { BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { Button, Text, TextInput, Provider as PaperProvider, useTheme } from 'react-native-paper';

const CalculatorBottomSheet = memo(({ initial, open, setOpen, setResult }) => {
  const ref = useRef(null);
  const [input, setInput] = useState(initial);
  const theme = useTheme();

  const handleSheetChange = useCallback(index => {
    console.log('handleSheetChange', index);

    if (index === -1) {
      setOpen(false);
    }
  }, [setOpen]);

  const handlePress = useCallback((value) => {
    if (value === '=') {
      try {
        setInput(eval(input).toString());
      } catch (e) {
        setInput('Error');
      }
    } else if (value === 'C') {
      setInput('');
    } else if (value === 'DEL') {
      setInput(input.slice(0, -1));
    } else if (value === '✓') {
      try {
        const output = eval(input);
        setInput(output.toString());
        setResult(output);
        ref.current.close();
      } catch (e) {
        setInput('Error');
      }
    } else {
      setInput((prev) => {
        if(prev === '0' || prev === 0){
          return value;
        }else{
          return prev + value;
        }
      });

    }
  }, [input, setResult]);

  const renderBackdrop = useCallback(
    (props) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.1}
      />
    ),
    []
  );

  return (
    <BottomSheet
      ref={ref}
      backgroundStyle={{ backgroundColor: theme.colors.surface }}
      handleIndicatorStyle={{ backgroundColor: theme.colors.primary }}
      onChange={handleSheetChange}
      snapPoints={[450]}
      index={open ? 0 : -1}
      enablePanDownToClose={true}
      backdropComponent={renderBackdrop}
    >
      <View style={styles.container}>
        <TextInput
          mode="outlined"
          label="Input"
          value={'₹ ' + input}
          style={styles.input}
          disabled
          error={input === 'Error'}
        />
        {[
          [['AC', 'C'], ['÷', '/'], ['X', '*'], ['DEL', 'DEL']],
          ['7', '8', '9', '*'],
          ['4', '5', '6', '-'],
          ['1', '2', '3', '+'],
          ['0', '.', '=', '✓']
        ].map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((val, index) => (
              <Button
                key={index}
                mode="contained"
                onPress={() => handlePress(Array.isArray(val) ? val[1] : val)}
                style={styles.button}
              >
                {Array.isArray(val) ? val[0] : val}
              </Button>
            ))}
          </View>
        ))}
      </View>
    </BottomSheet>
  );
});

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
