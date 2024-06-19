import React, {useCallback, useEffect, useRef, useState} from 'react';
import {View, Text,TextInput as RNTextInput} from 'react-native';
import {Button, TextInput,Appbar} from 'react-native-paper';
import {Picker} from '@react-native-picker/picker';
import {useNavigation,useRoute} from '@react-navigation/native';

import {addTransactionThunk, updateTransactionThunk,deleteTransactionThunk} from '../store/actions/transactionActions';
import {useDispatch, useSelector} from 'react-redux';
import {transType} from '../store/reducers/transactionReducer';
import {getFormatedDate, todayDate} from '../helper/utility';
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
import { format, formatDistance, formatRelative, subDays } from 'date-fns'
import { formatDistanceToNow } from 'date-fns/formatDistanceToNow';
import RenderTimer from '../helper/renderTimer';


function AppHeader({isEditing}) {
  const navigation = useNavigation();
  return (
    <ThemedAppBar>
      <Appbar.BackAction onPress={() => navigation.canGoBack && navigation.goBack()} />
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
  const [openToAccountModal, setopenToAccountModal] = useState(false);
  const [openCalculatorModal, setopenCalculatorModal] = useState(true);

  const initialState = transaction ? {
    type: transaction.type,
    date: transaction.date,
    amount: transaction.amount,
    accountId: transaction.accountId,
    toAccountId: transaction.toAccountId || null,
    categoryId: transaction.categoryId,
    notes: transaction.notes,
    desc: transaction.desc,
  } : {
    type: transType.INCOME,
    date: todayDate(),
    amount: 0,
    accountId: accounts[0] ? accounts[0].id : null,
    toAccountId: null,
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
  notes: Yup.string().required('Transaction name is required'),
  categoryId:  Yup.string().when('type', {
    is: (value) => value === transType.TRANSFER, // Corrected condition
    then: ()=> Yup.string().notRequired(),
    otherwise: ()=> Yup.string().required('Category name is required'),
  }),
  accountId: Yup.string().required('Account name is required'),
  toAccountId: Yup.string().when('type', {
    is: (value) => value === transType.TRANSFER, // Corrected condition
    then: ()=> Yup.string().required('To Account name is required'),
    otherwise: ()=> Yup.string().notRequired(),
  }),
  amount: Yup.number().required('Amount is required'),
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

  const filteredCategories =  categories.filter(
    category => category.type === formik.values.type,
  );

  const handleOpenCategoriesModal = ()=>{
      console.log("openCategoriesModal")
      setopenCategoriesModal(true)
  }

 
  const handleOpenAccountModal = ()=>{
    console.log("open Account Model")
    setopenAccountModal(true)
}
  const handleOpenToAccountModal = ()=>{
    console.log("open To Accoutn Model")
    setopenToAccountModal(true)
}

  return (
    <RenderTimer screenName="AddTransactionForm">
    <View style={{flex: 1}}>
      <AppHeader isEditing={transaction}/>
    <View style={{padding: 20}}>
      <View style={{flexDirection: 'row', alignSelf: 'center'}}>
        <Button
          style={{marginRight: 10}}
          icon="arrow-bottom-left-thin"
          mode={
            formik.values.type == transType.INCOME ? 'contained' : 'outlined'
            }
            onPress={() => formik.setFieldValue('type', transType.INCOME)}>
          INCOME
        </Button>
        <Button
        style={{marginRight: 10}}
          icon="arrow-top-right"
          mode={
            formik.values.type == transType.EXPENSE ? 'contained' : 'outlined'
            }
            onPress={() => formik.setFieldValue('type', transType.EXPENSE)}>
          Expense
        </Button>
        <Button
          icon="arrow-left-right"
          style={{borderWidth: 1, borderColor: 'orange'}}
          mode={
            formik.values.type == transType.TRANSFER ? 'contained' : 'outlined'
            }
            onPress={() => formik.setFieldValue('type', transType.TRANSFER)}>
          Transfer
        </Button>
      </View>

      <View style={{flexDirection: 'row',alignSelf:'center',marginVertical:10}}>
        <Button
          mode='elevated'
          style={{marginRight: 10}}
          onPress={showDatepicker}
          title="Show date picker!">
          {getFormatedDate(dateTime)}
        </Button>
        <Button
          mode='elevated'
          onPress={showTimepicker}
          title="Show time picker!">
          {dateTime.toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
            })}
        </Button>
      </View>
      {/* <Text>Date ISO STring :{dateTime.toLocaleString('en-IN')}</Text> */}

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

      {
        formik.values.type !== transType.TRANSFER  && (<Button mode='outlined' onPress={()=>handleOpenCategoriesModal()}>{formik.values.categoryId ? filteredCategories.find(item => item.id === formik.values.categoryId)?.name : 'Select Category'}</Button>)
      }
     
      <Text>

        { formik.values.type === transType.TRANSFER ? 'From Accounts' : 'Account'}
      </Text>


      
      <Button mode='outlined' onPress={()=>handleOpenAccountModal()}>{formik.values.accountId ? accounts.find(item => item.id === formik.values.accountId)?.name : 'Select Account'}</Button>
      <Text
        style={{
          color:
          formik.errors.toAccountId && formik.touched.toAccountId
          ? 'red'
          : null,
          }}>
            {formik.values.type === transType.TRANSFER ? 'To Accounts' : null}
       
        {formik.errors.toAccountId && formik.touched.toAccountId
          ? formik.errors.toAccountId
          : null}
      </Text>

       
       
        {
          formik.values.type === transType.TRANSFER ? 
          <View>
             <Text>To Accounts</Text>
            <Button mode='outlined' onPress={()=>handleOpenToAccountModal()}>{formik.values.toAccountId ? accounts.find(item => item.id === formik.values.toAccountId)?.name : 'Select Account'}</Button>
            
            </View>:null
        }
   

    

    
{/*         
              <TextInput
                name="amount"
                keyboardType="numeric"
                placeholder="Amount "
                value={formik.values.amount}
                onBlur={formik.handleBlur('amount')}
                onChangeText={formik.handleChange('amount')}
                error={formik.errors.amount && formik.touched.amount}
                /> */}

        <TouchableOpacity style={{marginBottom:10}} onPress={() =>setopenCalculatorModal(true)} activeOpacity={1}>
          <View pointerEvents="none">
              <TextInput
                value={formik.values.amount.toString()}
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
        style={{marginVertical: 10}}
        mode="contained"
        onPress={formik.handleSubmit}>
        Save
      </Button>

      <Button
        icon="plus"
        mode="outlined"
        onPress={() => navigation.navigate('categories')}>
        Categories
      </Button>
      
      {transaction && <Button icon='delete-forever' style={{marginVertical: 10}} mode='contained-tonal' buttonColor='pink' onPress={deleteTransaction}>
        Delete Entry
      </Button>}
    </View>

     
    

    <CategoryBottomSheet open={openCategoriesModal} setOpen={setopenCategoriesModal} categories={filteredCategories} selectedCategory={formik.values.categoryId} setselectedCategory={formik.setFieldValue}/>
    <AccountBottomSheet type = {transType.INCOME} open={openAccountModal} setOpen={setopenAccountModal} accounts={accounts} selectedAccount={formik.values.accountId} setselectedAccount={formik.setFieldValue}/>
    <AccountBottomSheet type = {transType.TRANSFER} open={openToAccountModal} setOpen={setopenToAccountModal} accounts={accounts} selectedAccount={formik.values.toAccountId} setselectedAccount={formik.setFieldValue}/>
    <Calculator  initial={formik.values.amount}  open={openCalculatorModal}  setOpen={setopenCalculatorModal} setResult={formik.setFieldValue}/>
</View>
</RenderTimer>
  );
};


export default AddTransactionForm;
