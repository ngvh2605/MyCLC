import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import "firebase/database";
import "firebase/remote-config";

import { FirebaseAnalytics } from "@capacitor-community/firebase-analytics";

// Replace the following with the config for your own Firebase project
// https://firebase.google.com/docs/web/setup#config-object
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBjvmaL74avSb3Tgq-zzMy2aep9hRdJ8Ys",
  authDomain: "myclcproject.firebaseapp.com",
  databaseURL:
    "https://myclcproject-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "myclcproject",
  storageBucket: "myclcproject.appspot.com",
  messagingSenderId: "255123725077",
  appId: "1:255123725077:web:52f5a65f712942ff71e71c",
  measurementId: "G-2MH3RQ0XR4",
};

FirebaseAnalytics.initializeFirebase({
  apiKey: "AIzaSyBjvmaL74avSb3Tgq-zzMy2aep9hRdJ8Ys",
  authDomain: "myclcproject.firebaseapp.com",
  databaseURL:
    "https://myclcproject-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "myclcproject",
  storageBucket: "myclcproject.appspot.com",
  messagingSenderId: "255123725077",
  appId: "1:255123725077:web:52f5a65f712942ff71e71c",
  measurementId: "G-2MH3RQ0XR4",
}).then(() => {
  FirebaseAnalytics.enable();
});

const app = firebase.initializeApp(firebaseConfig);
export const auth = app.auth();
export const firestore = app.firestore();
export const storage = app.storage();
export const database = app.database();
export const remoteConfig = app.remoteConfig();
remoteConfig.settings = {
  minimumFetchIntervalMillis: 0,
  fetchTimeoutMillis: 60000,
};
export const facebookProvider = new firebase.auth.FacebookAuthProvider();
export const googleProvider = new firebase.auth.GoogleAuthProvider();
