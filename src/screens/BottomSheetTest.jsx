import React, { useRef, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';

const categories = ['Category 1', 'Category 2', 'Category 3', 'Category 4'];

const CategoryBottomSheet = () => {
  const sheetRef = useRef(null);
  const [selectedCategory, setSelectedCategory] = React.useState('');

  const handleCategorySelect = useCallback((category) => {
    setSelectedCategory(category);
    sheetRef.current.close();
  }, []);

  const snapPoints = useMemo(() => ['25%'], []);

  const renderCategories = () => (
    <View style={styles.categoryContainer}>
      {categories.map((category) => (
        <Button
          key={category}
          title={category}
          onPress={() => handleCategorySelect(category)}
        />
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <Button
        title={selectedCategory || 'Select Category'}
        onPress={() => sheetRef.current.expand()}
      />
      <BottomSheet
        ref={sheetRef}
        snapPoints={snapPoints}
        enablePanDownToClose
      >
        <View style={styles.contentContainer}>{renderCategories()}</View>
      </BottomSheet>
    </View>
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
});

export default CategoryBottomSheet;