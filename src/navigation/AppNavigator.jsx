import * as React from 'react';
import {BottomNavigation, Text} from 'react-native-paper';
import TransactionForm from '../screens/Addtransaction';
import {NavigationContainer, useNavigation, useRoute} from '@react-navigation/native';
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
import { add } from 'date-fns';
import Stats from '../screens/Stats';




const Main = ({setTabIndex}) => {
  const [index, setIndex] = React.useState(0);
  const dispatch = useDispatch()
  const navigation = useNavigation();
  const route  = useRoute()

  const [routes] = React.useState([
    {key: 'home', title: 'Home', focusedIcon: 'home', unfocusedIcon: 'home'},
    {key: 'transaction', title: 'Transaction', focusedIcon: 'account-cash'},
    {key: 'Stats', title: 'Stats', focusedIcon: 'chart-box-outline'},
    {key: 'account', title: 'Account', focusedIcon: 'wallet'},
  ]);

  const renderScene = BottomNavigation.SceneMap({
    home: Home,
    transaction: ShowTransaction,
    account: ViewAccounts,
    Stats: Stats,
  });

  React.useEffect(() => {
    if (route.params?.initial) {
      setIndex(route.params.initial);
    }
  }, [route.params?.initial]);

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
