import {View, Text, StyleSheet} from 'react-native';
import React, {useRef, useCallback} from 'react';
import BottomSheet, {BottomSheetView} from '@gorhom/bottom-sheet';
import {BottomSheetFlatList} from '@gorhom/bottom-sheet';
import { Button } from 'react-native-paper';

const AccountBottomSheet = ({open, setOpen, accounts, selectedAccount,setselectedAccount}) => {
  const ref = useRef(null);

  const handleSheetChange = useCallback(index => {
    console.log('handleSheetChange', index);

    if (index === -1) {
      setOpen(false);
    }
  });

  const handleSelectAccount =  (accountId)=>{
    setselectedAccount('accountId',accountId);
    ref.current.close()
  }

  return (
    <BottomSheet
      ref={ref}
      onChange={handleSheetChange}
      snapPoints={[500, 500]}
      index={open ? 0 : -1}
      enablePanDownToClose={true}
      maxDynamicContentSize={false}
      >
      
      <BottomSheetFlatList
       style={styles.accountContainer}
        data={accounts}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => (
            <View  style={{flexGrow:1}}>
                <Button style={styles.accountButton} mode={selectedAccount===item.id?'contained':'elevated'}  onPress={()=>handleSelectAccount(item.id)}>{item.name}</Button>
            </View>
        )}

      />
    </BottomSheet>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },
  accountContainer: {
    padding: 20,
  },
  accountButton:{
    margin:10
  }

})
export default AccountBottomSheet;
