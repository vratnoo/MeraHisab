import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-paper';

const Calculator = ({ open, onClose }) => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState(null);

  const handlePress = (value) => {
    if (value === '=') {
      try {
        setResult(eval(input));
      } catch (error) {
        setResult('Error');
      }
    } else if (value === 'C') {
      setInput('');
      setResult(null);
    } else {
      setInput(input + value);
    }
  };

  return (
    <Modal
      visible={open}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalBackground}>
        <View style={styles.container}>
          <Text style={styles.display}>
            {result !== null ? result : input}
          </Text>
          <View style={styles.row}>
            {['7', '8', '9', '/'].map((val) => (
              <Button key={val} style={styles.button} onPress={() => handlePress(val)}>{val}</Button>
            ))}
          </View>
          <View style={styles.row}>
            {['4', '5', '6', '*'].map((val) => (
              <Button key={val} style={styles.button} onPress={() => handlePress(val)}>{val}</Button>
            ))}
          </View>
          <View style={styles.row}>
            {['1', '2', '3', '-'].map((val) => (
              <Button key={val} style={styles.button} onPress={() => handlePress(val)}>{val}</Button>
            ))}
          </View>
          <View style={styles.row}>
            {['0', '.', '=', '+'].map((val) => (
              <Button key={val} style={styles.button} onPress={() => handlePress(val)}>{val}</Button>
            ))}
          </View>
          <View style={styles.row}>
            <Button style={styles.button} onPress={() => handlePress('C')}>C</Button>
            <Button style={styles.button} onPress={onClose}>Close</Button>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  container: {
    width: '100%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  display: {
    fontSize: 30,
    marginBottom: 20,
    textAlign: 'right',
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  button: {
    flex: 1,
    margin: 5,
  },
});

export default Calculator;
