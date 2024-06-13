import { useNavigation, useRoute } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text,Appbar } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { fetchAccounts } from '../store/reducers/accountReducer';
import { Transactions } from './Transactions';
import { selectFilteredTransactionByaccount, selectGroupTransactionsByAccount, selectTotalExpense, selectTotalExpenseByAccount, selectTotalIncome, selectTotalIncomeByAccount } from '../store/selector/transactionSelector';
import ThemedAppBar from '../components/ThemedAppBar';
function AppHeader({account}) {
    const navigation = useNavigation()
    const MORE_ICON = Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical';
    return (
      <ThemedAppBar>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={account ? account.name : "All " +"Transactions"} />
        <Appbar.Action icon='notebook-edit' onPress={() => navigation.navigate('addAccounts',{ account:account})} />
      </ThemedAppBar>
  
    );
  }

const AccountTransaction = ()=>{
    const route = useRoute()
    const {id} = route.params;
    const accounts = useSelector(fetchAccounts)
    const groupedTransactions = useSelector(selectFilteredTransactionByaccount(id))
    const totalIncome = useSelector(selectTotalIncomeByAccount(id));
    const totalExpense = useSelector(selectTotalExpenseByAccount(id));
  
    const transactionProps = { groupedTransactions, totalIncome, totalExpense };

    const account = accounts.find((item)=>item.id===id)
    console.log(account)

    return(
        <View style={{flex:1}}>

                <AppHeader account={account} />
                <Transactions transactionProps={transactionProps} />

        </View>
    )
}

const styles = StyleSheet.create({
    heading:{
        fontSize:20,
        color:'skyblue',
        textAlign:'center'
    }

})

export default AccountTransaction