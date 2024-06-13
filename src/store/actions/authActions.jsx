import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';

import { LOGIN_LOADING, LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT } from '../reducers/authReducer';

// Action Creators
export const loginLoading = () => ({ type: LOGIN_LOADING });
export const loginSuccess = user => ({
  type: LOGIN_SUCCESS,
  payload:{user: {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    // Add other serializable properties you need
  }},
});

export const loginFailure = (error) => ({ type: LOGIN_FAILURE, payload: error });
export const logout = () => ({ type: LOGOUT });

// Helper function to extract serializable user data
const extractUserData = (user) => ({
  uid: user.uid,
  displayName: user.displayName,
  email: user.email,
  emailVerified: user.emailVerified,
  phoneNumber: user.phoneNumber,
  photoURL: user.photoURL,
  providerId: user.providerId,
});

// Thunk Action for Google Sign-In
export const loginWithGoogle = () => async dispatch => {
  dispatch(loginLoading());
  try {
    await GoogleSignin.hasPlayServices();
    const userInfo = await GoogleSignin.signIn();
    const googleCredential = auth.GoogleAuthProvider.credential(userInfo.idToken);
    const userCredential = await auth().signInWithCredential(googleCredential);
    const user = extractUserData(userCredential.user);
    dispatch(loginSuccess(user));
  } catch (error) {
    dispatch(loginFailure(error.message));
  }
};

// Thunk Action for Sign Out
// Thunk Action for Sign Out
export const signOut = () => async dispatch => {
  try {
    await auth().signOut();
    await GoogleSignin.signOut();
    dispatch(logout());
    console.log("User signed out successfully");
  } catch (error) {
    console.error("Error signing out:", error);
  }
};
