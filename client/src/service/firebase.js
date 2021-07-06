import firebase from 'firebase/app'; // <-- This must be first
import 'firebase/auth';
import 'firebase/storage';
import 'firebase/firestore';

try {
  firebase.initializeApp({
    apiKey: 'AIzaSyA660EVyQmXy0g6z0f7Oo5kv0mdBcdJwRA',
    authDomain: 'react-chat-app-18560.firebaseapp.com',
    //databaseURL: process.env.REACT_APP_DATABASE_URL,
    projectId: 'react-chat-app-18560',
    storageBucket: 'react-chat-app-18560.appspot.com',
    messagingSenderId: '980913720260',
    appId: '1:980913720260:web:7c452f70a5faf9339ff291'
  });
} catch (error) {
  if (!/already exists/u.test(error.message)) {
    console.error('Firebase admin initialization error', error.stack);
  }
}

// Passing off firebase.auth() instead of firebase.auth
// allows us to share the same instance of Firebase throughout
// the entire app whenever we import it from here.

export const fb = {
  auth: firebase.auth(),
  storage: firebase.storage(),
  firestore: firebase.firestore(),
};
