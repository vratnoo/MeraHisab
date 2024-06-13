import * as React from 'react';
import {BottomNavigation, Text} from 'react-native-paper';
import TransactionForm from '../screens/Addtransaction';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AddCategoryForm from '../screens/Addcategory';
import AddTransactionForm from '../screens/Addtransaction';
import ShowTransaction from '../screens/Transactions';
import AddAccountForm from '../screens/AddAccount';
import ViewAccounts from '../screens/Accounts';
import AccountTransaction from '../screens/accountTransaction';
import { fetchAccountsThunk } from '../store/actions/accountActions';
import { fetchTransactionThunk } from '../store/actions/transactionActions';
import { fetchCategoriesThunk } from '../store/actions/categoryActions';
import { useDispatch } from 'react-redux';
import Home from '../screens/Home';
import Categories from '../screens/Categories';
import BottomSheetTest from '../screens/BottomSheetTest';




const Main = ({setTabIndex}) => {
  const [index, setIndex] = React.useState(0);
  const dispatch = useDispatch()

  const [routes] = React.useState([
    {key: 'home', title: 'Home', focusedIcon: 'home', unfocusedIcon: 'home'},
    {key: 'transaction', title: 'Transaction', focusedIcon: 'account-cash'},
    {
      key: 'addTransaction',
      title: 'Add Transaction',
      focusedIcon: 'plus',
      unfocusedIcon: 'plus',
    },
    {key: 'account', title: 'Account', focusedIcon: 'wallet'},
  ]);

  const renderScene = BottomNavigation.SceneMap({
    home: Home,
    transaction: ShowTransaction,
    account: ViewAccounts,
    addTransaction: props => (
      <AddTransactionForm {...props} setTabIndex={setIndex} />
    ),
  });

  React.useEffect(() => {
    if (setTabIndex) {
      setTabIndex(setIndex);
    }
  }, [setTabIndex]);

  React.useEffect(() => {
    dispatch(fetchAccountsThunk());
    dispatch(fetchCategoriesThunk());
    dispatch(fetchTransactionThunk());
  }, [dispatch]);

  return (
    <BottomNavigation
      navigationState={{index, routes}}
      onIndexChange={setIndex}
      renderScene={renderScene}
    />
  );
};

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const [setTabIndex, setSetTabindex] = React.useState(null);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Main"
          component={Main}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="addTransaction"
          component={AddTransactionForm}
          options={{
            headerShown: false,
          }}
          
        />

        <Stack.Screen
          name="transaction"
          component={ShowTransaction}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="addCategory"
          component={AddCategoryForm}
          options={{title: 'Add Category'}}
        />
        <Stack.Screen
          name="categories"
          component={Categories}
          options={{title: 'Add Category'}}
        />
        <Stack.Screen
          name="addAccounts"
          component={AddAccountForm}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="accountTransaction"
          component={AccountTransaction}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="BottomSheetTest"
          component={BottomSheetTest}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;