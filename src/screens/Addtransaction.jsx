import React, { useCallback, useEffect, useState, memo,useMemo} from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Button, TextInput, Appbar, useTheme } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { fetchAccounts } from '../store/reducers/accountReducer';
import { fetchCategories } from '../store/actions/categoryActions';
import { addTransactionThunk, updateTransactionThunk, deleteTransactionThunk } from '../store/actions/transactionActions';
import { transType } from '../store/reducers/transactionReducer';
import { getFormatedDate, todayDate } from '../helper/utility';
import ThemedAppBar from '../components/ThemedAppBar';
import CategoryBottomSheet from '../components/CategoryBottomSheet';
import AccountBottomSheet from '../components/AccountBottomSheet';
import Calculator from '../components/Calculator';
import RenderTimer from '../helper/renderTimer';

const AppHeader = memo(({ isEditing }) => {
  const navigation = useNavigation();
  return (
    <ThemedAppBar>
      <Appbar.BackAction onPress={() => navigation.canGoBack && navigation.goBack()} />
      <Appbar.Content title={isEditing ? "Edit Transaction" : "Add Transaction"} />
    </ThemedAppBar>
  );
});

const AddTransactionForm = ({ setTabIndex }) => {
  const route = useRoute();
  const transaction = route.params?.transaction || null;
  const [dateTime, setDateTime] = useState(new Date());
  const [type,setType] = useState(transaction?.type || transType.INCOME)
  const [amount,setAmount]   = useState(transaction?.amount || 0)
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const categories = useSelector(fetchCategories);
  const accounts = useSelector(fetchAccounts);

  // adding theme to the app scree
  const theme =  useTheme();

  const [openCategoriesModal, setopenCategoriesModal] = useState(false);
  const [openAccountModal, setopenAccountModal] = useState(false);
  const [openToAccountModal, setopenToAccountModal] = useState(false);
  const [openCalculatorModal, setopenCalculatorModal] = useState(true);

  const initialState = transaction ? {
    ...transaction,
  } : {
    type: transType.INCOME,
    amount: 0,
    accountId: accounts[0]?.id || null,
    toAccountId: null,
    categoryId: null,
    notes: '',
    desc: '',
  };

  useEffect(() => {
    if (transaction) {
      setDateTime(new Date(transaction.date));
    }
  }, [transaction]);
  
  const validationSchema = Yup.object({
    notes: Yup.string().required('Transaction name is required'),
    categoryId: Yup.string().test(
      'categoryRequired',
      'Category is required for income and expenses',
      function (value) {
        return type === transType.TRANSFER || Yup.string().isValid(value);
      }
    ).notRequired(),
    accountId: Yup.string().required('Account name is required'),
    toAccountId: Yup.string().test(
      'toAccountRequired',
      'To Account is required for transfers',
      function (value) {
        return (type !== transType.TRANSFER) || Yup.string().isValid(value);
      }
    ).notRequired(),
    amount: Yup.number().required('Amount is required'),
    desc: Yup.string().required('Category name is required'),
  });


  const formik = useFormik({
    initialValues: initialState,
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      if (transaction) {
        dispatch(updateTransactionThunk({ ...values, date: dateTime.toISOString(), id: transaction.id,type: type,amount:amount}));
      } else {
        dispatch(addTransactionThunk({ ...values, date: dateTime.toISOString(),type: type,amount:amount}));
      }
      resetForm();
      setAmount(0);
      navigation.navigate('Main');
    },
  });

  const onDateChange = useCallback((event, selectedDate) => {
    const currentDate = selectedDate || dateTime;
    setDateTime(currentDate);
  }, [dateTime]);

  const onTimeChange = useCallback((event, selectedTime) => {
    const currentTime = selectedTime || dateTime;
    const newDateTime = new Date(dateTime);
    newDateTime.setHours(currentTime.getHours());
    newDateTime.setMinutes(currentTime.getMinutes());
    setDateTime(newDateTime);
  }, [dateTime]);

  const showMode = useCallback((currentMode) => {
    DateTimePickerAndroid.open({
      value: dateTime,
      onChange: currentMode === 'date' ? onDateChange : onTimeChange,
      mode: currentMode,
      is24Hour: false,
      
    });
  }, [dateTime]);


  const showDatepicker = useCallback(() => {
    showMode('date');
  }, [showMode]);

  const showTimepicker = useCallback(() => {
    showMode('time');
  }, [showMode]);

  const handleOpenCategoriesModal = useCallback(() => {
    setopenCategoriesModal(true);
  }, []);

  const handleOpenAccountModal = useCallback(() => {
    setopenAccountModal(true);
  }, []);

  const handleOpenToAccountModal = useCallback(() => {
    setopenToAccountModal(true);
  }, []);

  const handleCalculatorResult = useCallback((value) => {
    setAmount(value);
    // queueMicrotask(() => {
    //   formik.setFieldValue('amount', value);
    // });
    // setopenCalculatorModal(false);
  })  

  const filteredCategories = useMemo(() => {
    return categories.filter(
      category => category.type === type,
    );
  }, [categories, type]);

  return (
    <RenderTimer screenName="AddTransactionForm">
      <View style={{ flex: 1,backgroundColor:theme.colors.background}}>
        <AppHeader isEditing={transaction} />
        <View style={{ padding: 20 }}>
          <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
            <Button
              style={{ marginRight: 10 }}
              icon="arrow-bottom-left-thin"
              mode={type === transType.INCOME ? 'contained' : 'outlined'}
              onPress={() =>setType(transType.INCOME)}
            >
              INCOME
            </Button>
            <Button
              style={{ marginRight: 10 }}
              icon="arrow-top-right"
              mode={type === transType.EXPENSE ? 'contained' : 'outlined'}
              onPress={() =>  setType(transType.EXPENSE)}
            >
              Expense
            </Button>
            <Button
              icon="arrow-left-right"
              style={{ borderWidth: 1, borderColor: 'orange' }}
              mode={type === transType.TRANSFER ? 'contained' : 'outlined'}
              onPress={() => setType(transType.TRANSFER)}
            >
              Transfer
            </Button>
          </View>
          <View style={{ flexDirection: 'row', alignSelf: 'center', marginVertical: 10 }}>
            <Button mode='elevated' style={{ marginRight: 10 }} onPress={showDatepicker}>
              {getFormatedDate(dateTime)}
            </Button>
            <Button mode='elevated' onPress={showTimepicker}>
              {dateTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}
            </Button>
          </View>
          <Text style={{ color: formik.errors.amount && formik.touched.amount ? 'red' : null }}>
            Amount {formik.errors.amount && formik.touched.amount ? formik.errors.amount : null}
          </Text>
          <TouchableOpacity style={{ marginBottom: 10 }} onPress={() => setopenCalculatorModal(true)} activeOpacity={1}>
            <View pointerEvents="none">
              <TextInput value={amount.toString()} editable={false} />
            </View>
          </TouchableOpacity>
          
          <Text style={{ color: formik.errors.categoryId && formik.touched.categoryId ? 'red' : null }}>
            Category {formik.errors.categoryId && formik.touched.categoryId ? formik.errors.categoryId : null}
          </Text>
          {type !== transType.TRANSFER && (
            <Button mode='outlined' onPress={handleOpenCategoriesModal}>
              {formik.values.categoryId ? filteredCategories.find(item => item.id === formik.values.categoryId)?.name : 'Select Category'}
            </Button>
          )}
          <Text>{type === transType.TRANSFER ? 'From Accounts' : 'Account'}</Text>
          <Button mode='outlined' onPress={handleOpenAccountModal}>
            {formik.values.accountId ? accounts.find(item => item.id === formik.values.accountId)?.name : 'Select Account'}
          </Button>
          <Text style={{ color: formik.errors.toAccountId && formik.touched.toAccountId ? 'red' : null }}>
            {type === transType.TRANSFER ? 'To Accounts' : null}
            {formik.errors.toAccountId && formik.touched.toAccountId ? formik.errors.toAccountId : null}
          </Text>
          {type === transType.TRANSFER && (
            <View>
              <Text>To Accounts</Text>
              <Button mode='outlined' onPress={handleOpenToAccountModal}>
                {formik.values.toAccountId ? accounts.find(item => item.id === formik.values.toAccountId)?.name : 'Select Account'}
              </Button>
            </View>
          )}

          <TextInput
            name="name"
            style={{ marginVertical: 10 }}
            label={'Transaction Name'}
            value={formik.values.notes}
            onBlur={formik.handleBlur('notes')}
            onChangeText={formik.handleChange('notes')}
            error={formik.errors.notes && formik.touched.notes}
          />
         
          <TextInput
            name="Description"
            style={{ marginVertical: 10 }}
            placeholder="Description"
            value={formik.values.desc}
            onBlur={formik.handleBlur('desc')}
            onChangeText={formik.handleChange('desc')}
            error={formik.errors.desc && formik.touched.desc}
          />
          <Button icon="content-save-check" style={{ marginVertical: 10 }} mode="contained" onPress={formik.handleSubmit}>
            Save
          </Button>
          <Button icon="plus" mode="outlined" onPress={() => navigation.navigate('categories')}>
            Categories
          </Button>
          {transaction && (
            <Button icon='delete-forever' style={{ marginVertical: 10 }} mode='contained-tonal' buttonColor='pink' onPress={() => {
              dispatch(deleteTransactionThunk(transaction.id));
              navigation.navigate('Main');
            }}>
              Delete Entry
            </Button>
          )}
        </View>
  
        <CategoryBottomSheet open={openCategoriesModal} setOpen={setopenCategoriesModal} categories={filteredCategories} selectedCategory={formik.values.categoryId} setselectedCategory={formik.setFieldValue} />
        <AccountBottomSheet type={transType.INCOME} open={openAccountModal} setOpen={setopenAccountModal} accounts={accounts} selectedAccount={formik.values.accountId} setselectedAccount={formik.setFieldValue} />
        {(type===transType.TRANSFER) && <AccountBottomSheet type={transType.TRANSFER} open={openToAccountModal} setOpen={setopenToAccountModal} accounts={accounts} selectedAccount={formik.values.toAccountId} setselectedAccount={formik.setFieldValue} />}
        <Calculator   initial={amount} open={openCalculatorModal} setOpen={setopenCalculatorModal} setResult={handleCalculatorResult} />
          
      </View>
    </RenderTimer>
  );
};

export default AddTransactionForm;
