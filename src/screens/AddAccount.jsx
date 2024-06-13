import React, { useState } from 'react';
import { View } from 'react-native';
import { Button, TextInput,Appbar } from 'react-native-paper';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { addAccountThunk, updateAccountThunk,deleteAccountThunk } from '../store/actions/accountActions';
import ThemedAppBar from '../components/ThemedAppBar';

function AppHeader({account}) {
  const navigation = useNavigation()
  const dispatch = useDispatch()
  const MORE_ICON = Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical';
  const deleteAccount =  () => {
     dispatch(deleteAccountThunk(account.id));
    navigation.navigate('Main'); 
  };

  return (
    <ThemedAppBar>
      <Appbar.BackAction onPress={() => navigation.goBack()} />
      <Appbar.Content title={account ? "Edit Account" : "Add Account"} />
      {account && <Appbar.Action icon='delete' onPress={() => deleteAccount()} />}
    </ThemedAppBar>

  );
}


const AddAccountForm = ({ setTabIndex}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const route = useRoute()
  const account = route.params?.account || null;

  const initialState = account || {
    name: '',
  };

  const validationSchema = Yup.object({
    name: Yup.string().required('Account name is required'),
  });

  const formik = useFormik({
    initialValues: initialState,
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      if (account) {
        dispatch(updateAccountThunk({ ...account, ...values }));
      } else {
        dispatch(addAccountThunk({...values }));
      }
      resetForm();
      navigation.goBack();
    },
  });

  return (
    <View style={{flex:1}}>
      <AppHeader account={account}/>
      <View style={{ padding: 20, marginHorizontal: 15 }}>
        <TextInput
          name="name"
          label="Account Name"
          mode="outlined"
          value={formik.values.name}
          onBlur={formik.handleBlur('name')}
          onChangeText={formik.handleChange('name')}
          error={formik.errors.name && formik.touched.name}
        />

        <Button
          style={{ marginTop: 20 }}
          icon="plus"
          mode="contained"
          onPress={formik.handleSubmit}
        >
          Save
        </Button>
      </View>
      
    </View>
  );
};

export default AddAccountForm;
