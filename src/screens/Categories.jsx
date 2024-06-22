import { FlatList, StyleSheet, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Text, FAB, useTheme } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'
import { transType } from '../store/reducers/transactionReducer'
import { deleteCategoryThunk } from '../store/actions/categoryActions'

export default function Categories() {
    const categories = useSelector(state => state.categories.entities)
    const navigation = useNavigation()
    const [type, setType] = useState(transType.INCOME)
    const  theme = useTheme()
    const dispatch = useDispatch()
    useEffect(() => {
        console.log(categories)
    }, [])

    deleteCategory = (id) => {
        dispatch(deleteCategoryThunk(id))
    }
    return (
        <View style={[styles.container,{backgroundColor:theme.colors.background}]}>
            <View style={styles.buttonContainer}>
                <Button
                    mode={type === transType.INCOME ? 'contained' : 'outlined'}
                    style={styles.button}
                    onPress={() => setType(transType.INCOME)}
                >
                    Income
                </Button>
                <Button
                    mode={type === transType.EXPENSE ? 'contained' : 'outlined'}
                    style={styles.button}
                    onPress={() => setType(transType.EXPENSE)}
                >
                    Expense
                </Button>
            </View>
            <FlatList
                data={categories.filter(c => c.type === type)}
                renderItem={({ item }) => (
                    <View style={styles.itemContainer}>
                        <Text variant='titleMedium' style={styles.itemText}>{item.name}</Text>
                        <Button style={styles.editButton} onPress={() => navigation.navigate('addCategory', { category: item })}>Edit</Button>
                        <Button style={styles.deleteButton} onPress={()=>deleteCategory(item.id)}>Delete</Button>
                    </View>
                )}
                keyExtractor={item => item.id}
            />
            <FAB
                icon="plus"
                style={styles.fab}
                onPress={() => navigation.navigate('addCategory')}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        alignSelf: 'center',
        marginBottom: 20,
    },
    button: {
        marginHorizontal: 5,
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderColor: '#ddd',
        borderWidth: 1,
        padding: 10,
        marginVertical: 5,
        borderRadius: 5,
    },
    itemText: {
        flex: 1,
    },
    editButton: {
        marginRight: 10,
    },
    deleteButton: {
        marginLeft: 10,
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
        backgroundColor: '#6200ee',
    },
})
