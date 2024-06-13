import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {Button, TextInput} from 'react-native-paper';
import {Picker} from '@react-native-picker/picker';
import * as Yup from 'yup';
import {useFormik} from 'formik';
import {useNavigation,useRoute} from '@react-navigation/native';
import {transType} from '../store/reducers/transactionReducer';
import { addCategoryThunk, updateCategoryThunk } from '../store/actions/categoryActions';
import {useDispatch} from 'react-redux';

const AddCategoryForm = ({setTabIndex}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const route = useRoute();
  const category = route.params?.category || null;

  const initialState = category || {
    name: '',
    type: transType.EXPENSE,
  };

  useEffect(()=>{
    console.log("category is here ",category)
  },[])

  const validationSchema = Yup.object({
    name: Yup.string().required('Category name is required'),
  });

  const formik = useFormik({
    initialValues: initialState,
    validationSchema,
    onSubmit: (values, {resetForm}) => {
      if (category) {
        dispatch(updateCategoryThunk({...category, ...values}));
      } else {
        dispatch(addCategoryThunk({...values}));
      }
      resetForm();
      navigation.goBack();
    },
  });

  return (
    <View style={{padding: 20}}>
      <Picker
        selectedValue={formik.values.type}
        onValueChange={(itemValue) =>
          formik.setFieldValue('type', itemValue)
        }>
        <Picker.Item label="Income" value={transType.INCOME} />
        <Picker.Item label="Expense" value={transType.EXPENSE} />
      </Picker>

      <TextInput
        name="name"
        label={'Category Name'}
        mode="outlined"
        value={formik.values.name}
        onBlur={formik.handleBlur('name')}
        onChangeText={formik.handleChange('name')}
        error={formik.errors.name && formik.touched.name}
      />

      <Button
        style={{margin: 10}}
        icon="plus"
        mode="contained"
        onPress={formik.handleSubmit}>
        Save
      </Button>
    </View>
  );
};

export default AddCategoryForm;
