import React, {useCallback, useEffect, useRef, useState} from 'react';
import {View, Text,TextInput as RNTextInput} from 'react-native';
import {Button, TextInput,Appbar} from 'react-native-paper';
import BottomSheet, {BottomSheetView} from '@gorhom/bottom-sheet';
import {Picker} from '@react-native-picker/picker';
import {useNavigation,useRoute} from '@react-navigation/native';

import {addTransactionThunk, updateTransactionThunk,deleteTransactionThunk} from '../store/actions/transactionActions';
import {useDispatch, useSelector} from 'react-redux';
import {transType} from '../store/reducers/transactionReducer';
import {todayDate} from '../helper/utility';
import * as Yup from 'yup';
import {useFormik} from 'formik';
import {DateTimePickerAndroid} from '@react-native-community/datetimepicker';
import { fetchAccounts } from '../store/reducers/accountReducer';
import { fetchCategories } from '../store/actions/categoryActions';
import ThemedAppBar from '../components/ThemedAppBar';
import CategoryBottomSheet from '../components/CategoryBottomSheet';
import AccountBottomSheet from '../components/AccountBottomSheet';
import Calculator from '../components/Calculator';
import { TouchableOpacity } from 'react-native-gesture-handler';


function AppHeader({isEditing}) {
  const navigation = useNavigation();
  return (
    <ThemedAppBar>
      <Appbar.BackAction onPress={() => navigation.goBack()} />
      <Appbar.Content title= {isEditing?"Edit Transaction":"Add Transaction"} />
    </ThemedAppBar>

  );
}

const AddTransactionForm = ({setTabIndex}) => {
  const route = useRoute();
  const transaction = route.params?.transaction || null;
  const [dateTime, setDateTime] = useState(new Date());
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const categories = useSelector(fetchCategories);
  const accounts = useSelector(fetchAccounts)

  const [openCategoriesModal, setopenCategoriesModal] = useState(false);

  const [openAccountModal, setopenAccountModal] = useState(false);
  const [openCalculatorModal, setopenCalculatorModal] = useState(false);

  const initialState = transaction ? {
    type: transaction.type,
    date: transaction.date,
    amount: transaction.amount,
    accountId: transaction.accountId,
    categoryId: transaction.categoryId,
    notes: transaction.notes,
    desc: transaction.desc,
  } : {
    type: transType.INCOME,
    date: todayDate(),
    amount: 0,
    accountId: accounts[0] ? accounts[0].id : null,
    categoryId: null,
    notes: '',
    desc: '',
  };

  useEffect(()=>{
    console.log("transaction is here ",transaction)
    if(transaction){
      setDateTime(new Date(transaction.date))
    }
  },[])
  const validationSchema = Yup.object({
    notes: Yup.string().required('Category name is required'),
    categoryId: Yup.string().required('Category name is required'),
    accountId: Yup.string().required('Category name is required'),
    amount: Yup.number(),
    desc: Yup.string().required('Category name is required'),
  });

  const formik = useFormik({
    initialValues: initialState,
    validationSchema,
    onSubmit: (values, {resetForm}) => {
      if(transaction){
        dispatch(updateTransactionThunk({...values,date: dateTime.toISOString(),id:transaction.id}));
      }else{
        dispatch(addTransactionThunk({...values,date: dateTime.toISOString()}));
        }
      resetForm();
      navigation.navigate('Main');

      // setTabIndex(1)
      // navigation.navigate('Main', { screen: 'account' });
    },
  });

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setDate(currentDate);
  };

  const deleteTransaction = ()=>{
    dispatch(deleteTransactionThunk(transaction.id))
    navigation.navigate('Main');
  }

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || dateTime;
    // setShowDatePicker(Platform.OS === 'ios');
    setDateTime(new Date(currentDate));
    formik.setFieldValue('date', currentDate.toISOString());
  };

  const onTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || dateTime;
    const newDateTime = new Date(dateTime);
    newDateTime.setHours(currentTime.getHours());
    newDateTime.setMinutes(currentTime.getMinutes());
    setDateTime(newDateTime);
    formik.setFieldValue('date', newDateTime.toISOString());
  };

  const showMode = currentMode => {
    DateTimePickerAndroid.open({
      value: dateTime,
      onChange: currentMode === 'date' ? onDateChange : onTimeChange,
      mode: currentMode,
      is24Hour: false,
    });
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const showTimepicker = () => {
    showMode('time');
  };

  const filteredCategories = categories.filter(
    category => category.type === formik.values.type,
  );

  const handleOpenCategoriesModal = ()=>{
      console.log("openCategoriesModal")
      setopenCategoriesModal(true)
  }

  const handleOpenAccountModal = ()=>{
    console.log("open Accoutn Model")
    setopenAccountModal(true)
}

  return (
    <View style={{flex: 1}}>
      <AppHeader isEditing={transaction}/>
    <View style={{padding: 20}}>
      <View style={{flexDirection: 'row', justifyContent: 'center'}}>
        <Button
          icon="arrow-bottom-left-thin"
          mode={
            formik.values.type == transType.INCOME ? 'contained' : 'outlined'
            }
            onPress={() => formik.setFieldValue('type', transType.INCOME)}>
          INCOME
        </Button>
        <Button
          icon="arrow-top-right"
          mode={
            formik.values.type == transType.EXPENSE ? 'contained' : 'outlined'
            }
            onPress={() => formik.setFieldValue('type', transType.EXPENSE)}>
          Expense
        </Button>
      </View>

      <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
        <Button
          style={{borderWidth: 1, borderColor: 'blue'}}
          value
          onPress={showDatepicker}
          title="Show date picker!">
          {dateTime.toLocaleDateString('en-IN')}
        </Button>
        <Button
          style={{borderWidth: 1, borderColor: 'blue'}}
          onPress={showTimepicker}
          title="Show time picker!">
          {dateTime.toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
            })}
        </Button>
      </View>
      <Text>Date ISO STring :{dateTime.toLocaleString('en-IN')}</Text>

      <TextInput
        name="name"
        label={'Transaction Name'}
        mode="outlined"
        value={formik.values.notes}
        onBlur={formik.handleBlur('notes')}
        onChangeText={formik.handleChange('notes')}
        error={formik.errors.notes && formik.touched.notes}
        />

      <Text
        style={{
          color:
          formik.errors.categoryId && formik.touched.categoryId
          ? 'red'
          : null,
          }}>

        Category
        {formik.errors.categoryId && formik.touched.categoryId
          ? formik.errors.categoryId
          : null}
      </Text>
      <Button mode='outlined' onPress={()=>handleOpenCategoriesModal()}>{formik.values.categoryId ? filteredCategories.find(item => item.id === formik.values.categoryId)?.name : 'Select Category'}</Button>

      <Picker
        selectedValue={formik.values.categoryId}
        onValueChange={(itemValue, itemIndex) =>
          // setFormData(state => ({...state, categoryId: itemValue}))
          formik.setFieldValue('categoryId', itemValue)
          }>
        <Picker.Item key={null} label={'Not Selected'} value={null} />
        {filteredCategories.map(item => (
          <Picker.Item key={item.id} label={item.name} value={item.id} />
          ))}
      </Picker>

      <Text>Accounts</Text>
      <Picker
        selectedValue={formik.values.accountId}
        onValueChange={(itemValue, itemIndex) =>
          // setFormData(state => ({...state, accountType: itemValue}))
          formik.setFieldValue('accountId', itemValue)
          }>

       {accounts.map(item => (
         <Picker.Item key={item.id} label={item.name} value={item.id} />
         ))}
      </Picker>

      <Button mode='outlined' onPress={()=>handleOpenAccountModal()}>{formik.values.accountId ? accounts.find(item => item.id === formik.values.accountId)?.name : 'Select Account'}</Button>
        
      <TouchableOpacity 
      onPress={()=>setopenCalculatorModal(true)}
      >

      <TextInput
        name="amount"
        keyboardType="numeric"
        placeholder="Amount "
        editable={false}
        value={formik.values.amount}
        onBlur={formik.handleBlur('amount')}
        onChangeText={formik.handleChange('amount')}
        error={formik.errors.amount && formik.touched.amount}
        />

        </TouchableOpacity>

        <TouchableOpacity onPress={() =>setopenCalculatorModal(true)} activeOpacity={1}>
          <View pointerEvents="none">
              <RNTextInput
                value={formik.values}
                editable={false} 
                
              />

          </View>
      </TouchableOpacity>
        
      <TextInput
        name="Description"
        placeholder="Description "
        value={formik.values.desc}
        onBlur={formik.handleBlur('desc')}
        onChangeText={formik.handleChange('desc')}
        error={formik.errors.desc && formik.touched.desc}
        />

      <Button
        icon="content-save-check"
        mode="contained"
        onPress={formik.handleSubmit}>
        Save
      </Button>

      {/* <MyBottomSheet/> */}
      <Button style={{marginTop: 10}} onPress={deleteTransaction}>
        Delete Entry
      </Button>

      <Button
        icon="plus"
        mode="outlined"
        onPress={() => navigation.navigate('categories')}>
        Categories
      </Button>
    </View>

    <CategoryBottomSheet open={openCategoriesModal} setOpen={setopenCategoriesModal} categories={filteredCategories} selectedCategory={formik.values.categoryId} setselectedCategory={formik.setFieldValue}/>
    <AccountBottomSheet open={openAccountModal} setOpen={setopenAccountModal} accounts={accounts} selectedAccount={formik.values.accountId} setselectedAccount={formik.setFieldValue}/>
    <Calculator  open={openCalculatorModal} setOpen={setopenCalculatorModal}/>
</View>
  );
};


export default AddTransactionForm;
