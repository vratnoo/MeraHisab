import {View, Text, StyleSheet} from 'react-native';
import React, {useRef, useCallback} from 'react';
import BottomSheet, {BottomSheetView} from '@gorhom/bottom-sheet';
import {BottomSheetFlatList} from '@gorhom/bottom-sheet';
import { Button } from 'react-native-paper';

const CategoryBottomSheet = ({open, setOpen, categories, selectedCategory,setselectedCategory}) => {
  const ref = useRef(null);

  const handleSheetChange = useCallback(index => {
    console.log('handleSheetChange', index);

    if (index === -1) {
      setOpen(false);
    }
  });

  const handleSelectCategory =  (categoryId)=>{
    console.log("handleSelectCategory",categoryId)
    setselectedCategory('categoryId',categoryId);
    ref.current.close()

  }
  return (
    <BottomSheet
      ref={ref}
      onChange={handleSheetChange}
      snapPoints={[500, 500]}
      index={open ? 0 : -1}
      enablePanDownToClose={true}>
      <BottomSheetFlatList
       style={styles.categoryContainer}
        data={categories}
        numColumns={3}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => (
            <View>
                <Button style={styles.categoryButton} mode={selectedCategory===item.id?'contained':'elevated'}  onPress={()=>handleSelectCategory(item.id)}>{item.name}</Button>
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
  categoryContainer: {
    padding: 20,
  },
  categoryButton:{
    margin:10
  }

})
export default CategoryBottomSheet;
