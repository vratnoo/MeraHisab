import React, {useEffect, useState} from 'react';
import {View, FlatList, StyleSheet, TouchableOpacity} from 'react-native';
import {Text, Card, Button, FAB} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import {
  fetchTransaction,
  transType,
} from '../store/reducers/transactionReducer';
import {
  selectBalance,
  selectTotalExpense,
  selectTotalIncome,
  g,
  selectGroupedTransactions,
  selectGroupTransactionsByAccount,
  selectSelectedMonth,
} from '../store/selector/transactionSelector';
import {format} from 'date-fns';
import {fetchAccounts} from '../store/reducers/accountReducer';
import {fetchCategories} from '../store/reducers/categoryReducer';
import {useNavigation} from '@react-navigation/native';
import MonthPicker from 'react-native-month-year-picker';
import {setSelectedMonth} from '../store/reducers/monthReducer';
import {fetchAccountsThunk} from '../store/actions/accountActions';

const ViewAccounts = () => {
  const navigation = useNavigation();
  const accounts = useSelector(fetchAccounts);
  const groupedAccounts = useSelector(selectGroupTransactionsByAccount);
  const [showPicker, setShowPicker] = useState(false);
  const selectedDate = useSelector(selectSelectedMonth);
  const dispatch = useDispatch();

  const onValueChange = (event, newDate) => {
    const date = newDate || selectedDate;
    setShowPicker(false);
    dispatch(setSelectedMonth(date));
  };

  useEffect(() => {
    dispatch(fetchAccountsThunk());
  }, [dispatch]);

  console.log('accoutn are here', groupedAccounts);

  return (
    <View style={{flex: 1, paddingHorizontal: 15}}>
      <Text> Account here</Text>
      <View>
        <Button onPress={() => setShowPicker(true)}>
          {format(new Date(selectedDate), 'MMMM yyyy')}
        </Button>
        {showPicker && (
          <MonthPicker
            onChange={onValueChange}
            value={new Date(selectedDate)}
            locale="en"
          />
        )}
      </View>
      <FlatList
        data={accounts}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => {
          // const accountSummary = groupedAccounts[item.id] || { totalIncome: 0, totalExpense: 0 };
          const accountSummary = (groupedAccounts &&
            groupedAccounts[item.id]) || {
            totalIncome: 0,
            totalExpense: 0,
            total: 0,
          };
          console.log('account summary is ', accountSummary);
          return (
            <TouchableOpacity
              style={styles.list}
              onPress={() =>
                navigation.navigate('accountTransaction', {id: item.id})
              }>
              <Text>{item.name}</Text>
              <Text style={styles.income}>{accountSummary.totalIncome}</Text>
              <Text style={styles.expense}>{accountSummary.totalExpense}</Text>
              <Text style={styles.total}> Rs {accountSummary.total}</Text>
            </TouchableOpacity>
          );
        }}
      />
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate('addAccounts')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  list: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 4,
    borderColor: 'gray',
    marginVertical: 5,
    padding: 7,
  },
  income: {
    color: 'green',
    fontWeight: '700',
  },
  expense: {
    color: 'red',
    fontWeight: '700',
  },
  total: {
    color: 'skyblue',
    fontWeight: '700',
  },
});

export default ViewAccounts;
