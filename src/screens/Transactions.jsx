import React, { useEffect, useState } from 'react';
import {View, FlatList, TouchableOpacity,StyleSheet} from 'react-native';
import {Text, Card, Button,FAB} from 'react-native-paper';
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
  selectSelectedMonth,
} from '../store/selector/transactionSelector';
import {format, parse} from 'date-fns';
import {fetchAccounts} from '../store/reducers/accountReducer';
import {fetchCategories, fetchCategoriesThunk} from '../store/actions/categoryActions'
import MonthPicker from 'react-native-month-year-picker';
import { setSelectedMonth } from '../store/reducers/monthReducer';
import { fetchTransactionThunk } from '../store/actions/transactionActions';
import { fetchAccountsThunk } from '../store/actions/accountActions';
import { useNavigation } from '@react-navigation/native';
import RenderTimer from '../helper/renderTimer';



const ShowTransaction = ()=>{
  const groupedTransactions = useSelector(selectGroupedTransactions);
  const totalIncome = useSelector(selectTotalIncome);
  const totalExpense = useSelector(selectTotalExpense);
  const total = useSelector(selectBalance);
  const dispatch = useDispatch()
  const navigation  = useNavigation()

  const transactionProps = { groupedTransactions, totalIncome, totalExpense,total};
  


    return (
    <View style={styles.container}>
      <Transactions transactionProps={transactionProps}/>  
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate('addTransaction')}
      />
    </View>)
}


export const Transactions = ({transactionProps}) => {
  const navigation = useNavigation()
  const categories = useSelector(fetchCategories);
  const accounts = useSelector(fetchAccounts);
  const selectedDate = useSelector(selectSelectedMonth)
  const dispatch = useDispatch()
  const {groupedTransactions,totalIncome,totalExpense,total} = transactionProps
  

  const balance = useSelector(selectBalance);
  const [showPicker, setShowPicker] = useState(false);

  const onValueChange = (event, newDate) => {
    const date = newDate || selectedDate;
    setShowPicker(false);
    dispatch(setSelectedMonth(date));
  };


  const transformGroupedTransactions = groupedTransactions => {
    const flatListData = [];

    Object.keys(groupedTransactions).forEach(date => {
      flatListData.push({
        type: 'header',
        date,
        totalIncome: groupedTransactions[date].totalIncome,
        totalExpense: groupedTransactions[date].totalExpense,
      });
      groupedTransactions[date].transactions.forEach(transaction => {
        flatListData.push({type: 'item', transaction});
      });
    });

    return flatListData;
  };

  const flatListData = transformGroupedTransactions(groupedTransactions);
  console.log('groped trans', groupedTransactions);

  const renderItem = ({item}) => {
    if (item.type === 'header') {
      return (
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text>{format(new Date(item.date), 'dd MMMM yyyy')}</Text>
          <View
            style={{
              flexDirection: 'row',
              width: '30%',
              justifyContent: 'space-between',
            }}>
            <Text style={{color: 'green', fontWeight: '800'}}>
              {item.totalIncome}
            </Text>
            <Text style={{color: 'red', fontWeight: '800'}}>
              {item.totalExpense}
            </Text>
            <Text style={{color: 'pink', fontWeight: '800'}}>
              {parseInt(item.totalIncome) - parseInt(item.totalExpense)}
            </Text>
          </View>
        </View>
      );
    }

    return (
      <TouchableOpacity onPress={() => {navigation.navigate('addTransaction', {transaction: item.transaction})}}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginVertical: 5,
          borderWidth: 1,
          borderRadius: 5,
          padding: 10,
          borderColor: 'gray',
        }}>
        <View>
          <Text style={{color: 'gray'}}>Category</Text>
          <Text style={{fontWeight: '400', fontSize: 15}}>
            {(item.transaction.categoryId !== null) ? categories.map(category =>
              category.id === item.transaction.categoryId ? category.name : '',
            ) : '<-Transfer->'}
          </Text>
        </View>
        <View>
          <Text style={{fontWeight: '800'}}>{item.transaction.notes}</Text>
          <View>
          <Text style={{color: 'gray'}}>
            { accounts.map(account =>
              account.id === item.transaction.accountId ? account.name : '',
            )}

            {
              (item.transaction.type == transType.TRANSFER) && " -> "
            }

            {(item.transaction.type == transType.TRANSFER) && accounts.map(account =>
              account.id === item.transaction.toAccountId ? account.name : '',
            )
            }

          </Text>

          </View>
          
          
        </View>
        <View style={{flexDirection: 'column', alignItems: 'center'}}>
          <Text
            style={{
              color:
                item.transaction.type === transType.INCOME ? 'blue' : 'red',
            }}>
            {item.transaction.amount}
          </Text>
          <Text>
            {new Date(item.transaction.date).toLocaleTimeString('en-IN', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: true,
            })}
          </Text>
        </View>
      </View>
      </TouchableOpacity>
    );
  };

  return (
    <RenderTimer screenName='ShowTransaction'>

    <View style={{flex: 1, paddingHorizontal: 15,paddingBottom: 65}}>
      <View style={{flexDirection: 'row', justifyContent: 'center'}}>
        <View>
        <Button onPress={() => setShowPicker(true)}>
        {format(new Date(selectedDate), 'MMMM yyyy')}
      </Button>
      {showPicker && (
        <MonthPicker
        onChange={onValueChange}
        value={new Date(selectedDate)}
        locale="en"
        />)}

        </View>
        <View
          style={{flexDirection: 'column', alignItems: 'center', margin: 10}}>
          <Text style={{fontSize: 20, color: 'blue'}}>Income</Text>
          <Text style={{fontSize: 20, margin: 10}}>{totalIncome}</Text>
        </View>
        <View
          style={{flexDirection: 'column', alignItems: 'center', margin: 10}}>
          <Text style={{fontSize: 20, color: 'red'}}>Expense</Text>
          <Text style={{fontSize: 20, margin: 10}}>{totalExpense}</Text>
        </View>
        <View
          style={{flexDirection: 'column', alignItems: 'center', margin: 10}}>
          <Text style={{fontSize: 20, color: 'black'}}>Total</Text>
          <Text style={{fontSize: 20, margin: 10}}>{parseInt(total)}</Text>
        </View>
      </View>

      <View style={{marginHorizontal: 15,marginBottom: 30}}>
        <FlatList
          data={flatListData}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          />
      </View>
    </View>
</RenderTimer>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  
});

export default ShowTransaction;
