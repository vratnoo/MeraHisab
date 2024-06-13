import {createSelector} from 'reselect';
import { transType } from '../reducers/transactionReducer';
import { format } from 'date-fns';
// selectors
export const fetchTransaction = state => {
  return state.transactions.entities;
};

export const selectSelectedMonth  = state=>state.month

export const selectTotalIncome = createSelector([fetchTransaction,selectSelectedMonth], (transactions,selectedMonth) =>
   {
    // const filterTransactiosByAccount = accountId ? transactions.filter((item)=>item.accountId===accountId) : transactions
    const filteredTransactions = filterTransactions(transactions,selectedMonth)
    return filteredTransactions.reduce((total, transaction) =>
    transaction.type === transType.INCOME ? total + parseInt(transaction.amount) : total,0
  )
}
);


export const selectTotalExpense = createSelector([fetchTransaction,selectSelectedMonth], (transaction,selectedMonth) =>
  {
   const filteredTransactions = filterTransactions(transaction,selectedMonth)
   return filteredTransactions.reduce((total, transaction) =>
   transaction.type === transType.EXPENSE ? total + parseInt(transaction.amount) : total,0
 )
}
);


  export const selectBalance = createSelector(
    [selectTotalIncome, selectTotalExpense],
    (income, expenses) => income - expenses,
  );


  // Function to group transactions by date
// const groupTransactionsByDate = (transactions) => {
//   return transactions.reduce((groups, transaction) => {
//     const date = format(new Date(transaction.date), 'yyyy-MM-dd');
//     if (!groups[date]) {
//       groups[date] = [];
//     }
//     groups[date].push(transaction);
//     return groups;
//   }, {});
// };


const groupTransactionsByDate = (transactions) => {
  return transactions.reduce((groups, transaction) => {
    const date = format(new Date(transaction.date), 'yyyy-MM-dd');
    if (!groups[date]) {
      groups[date] = {
        transactions: [],
        totalIncome: 0,
        totalExpense: 0,
      };
    }
    groups[date].transactions.push(transaction);
    if (transaction.type === 'income') {
      groups[date].totalIncome += parseFloat(transaction.amount);
    } else if (transaction.type === 'expense') {
      groups[date].totalExpense += parseFloat(transaction.amount);
    }
    return groups;
  }, {});
};



const filterTransactions =  (transactions,selectedMonth)=>{


  return transactions.filter((item)=>{
  
    // console.log('date and month',new Date(item.date).getFullYear(),date)
    const date = new Date(item.date)
    const newselectedMonth = new Date(selectedMonth)
    return date.getMonth() === newselectedMonth.getMonth() &&  date.getFullYear() === newselectedMonth.getFullYear() 
  })

}





// Memoized selector to sort and group transactions by date
export const selectGroupedTransactions = createSelector(
  [fetchTransaction,selectSelectedMonth],
  (transactions,selectedMonth) => {
    console.log("transaction are here ",transactions)
    const filteredTransactions = filterTransactions(transactions,selectedMonth) 
    console.log('filtred transaction are here',filteredTransactions)
    const sortedTransactions = [...filteredTransactions].sort((a, b) => new Date(b.date) - new Date(a.date));
    return groupTransactionsByDate(sortedTransactions);
  }
);

// account Selector
export const selectFilteredTransactionByaccount = (accountId)=>createSelector(
  [fetchTransaction,selectSelectedMonth],
  (transactions,selectedMonth) => {
    console.log("month here ",selectedMonth)
    const filteredTransactions = filterTransactions(transactions,selectedMonth) 
    console.log('filtred transaction are here',filteredTransactions)
    const filteredTransactionsByAccount = filteredTransactions.filter((item)=>item.accountId === accountId)
    const sortedTransactions = [...filteredTransactionsByAccount].sort((a, b) => new Date(b.date) - new Date(a.date));
    return groupTransactionsByDate(sortedTransactions);
    
  }
);

export const selectTotalIncomeByAccount = (accountId) => createSelector(
  [fetchTransaction, selectSelectedMonth],
  (transactions, selectedMonth) => {
    const filteredTransactions = filterTransactions(transactions, selectedMonth);
    const accountFilteredTransactions = accountId 
      ? filteredTransactions.filter(transaction => transaction.accountId === accountId)
      : filteredTransactions;

    return accountFilteredTransactions.reduce(
      (total, transaction) => transaction.type === transType.INCOME ? total + parseInt(transaction.amount) : total,
      0
    );
  }
);

export const selectTotalExpenseByAccount = (accountId) => createSelector(
  [fetchTransaction, selectSelectedMonth],
  (transactions, selectedMonth) => {
    const filteredTransactions = filterTransactions(transactions, selectedMonth);
    const accountFilteredTransactions = accountId 
      ? filteredTransactions.filter(transaction => transaction.accountId === accountId)
      : filteredTransactions;

    return accountFilteredTransactions.reduce(
      (total, transaction) => transaction.type === transType.EXPENSE ? total + parseInt(transaction.amount) : total,
      0
    );
  }
);



const groupTransactionsByAccount = (transactions) => {
  const accountSummary =  transactions.reduce((acc, transaction) => {

    const {accountId,type,amount} = transaction
      
      if(!acc[accountId]){
        acc[accountId] = {
          accountId,
          total:0,
          totalIncome : 0,
          totalExpense: 0
        }
      }

      if(type === transType.INCOME){
        acc[accountId].total += parseInt(amount);
        acc[accountId].totalIncome+=parseInt(amount)
      }else if(type === transType.EXPENSE){
        acc[accountId].total -= parseInt(amount);
        acc[accountId].totalExpense+=parseInt(amount)
      }

      return acc


  }, {});

  console.log('here ',accountSummary)

   return accountSummary
};



export const selectGroupTransactionsByAccount = createSelector(
  [fetchTransaction,selectSelectedMonth],
  (transactions,selectedMonth) => {

    const filteredTransactions = filterTransactions(transactions,selectedMonth)
    return groupTransactionsByAccount(filteredTransactions);
  }
);


