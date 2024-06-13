import React from 'react';
import { Button, Image, View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import { useDispatch } from 'react-redux';
import { signOut as googleSignOut } from '../store/actions/authActions';
import { useNavigation } from '@react-navigation/native';

const Home = () => {
    const dispatch = useDispatch();
    const user = auth().currentUser;
    const navigation = useNavigation()
    const signOut = () => {
        dispatch(googleSignOut());
    };

    return (
      <View style={styles.container}>
        <Text style={styles.title}>Home</Text>
        <Image source={{uri: user.photoURL}} style={styles.profileImage} />
        <Text style={styles.userInfo}>User Name: {user.displayName}</Text>
        <Text style={styles.userInfo}>Email: {user.email}</Text>
        <Button title="Logout" onPress={() => signOut()} color="#FF6B6B" />
        <Button
          title="Test"
          onPress={() => navigation.navigate('BottomSheetTest')}
        />
      </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F4F4F8',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 30,
        color: '#4A4E69',
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 20,
        borderWidth: 3,
        borderColor: '#9A8C98',
    },
    userInfo: {
        fontSize: 18,
        marginBottom: 15,
        color: '#22223B',
    },
});

export default Home;