import firebase from 'firebase/app';
import "firebase/auth";
import "firebase/firestore";
let config = {
    apiKey: "AIzaSyD5rcwXy2G1Tp6mmC42sAxRtqwLueAtKHw",
    authDomain: "efa-match-system.firebaseapp.com",
    projectId: "efa-match-system",
    storageBucket: "efa-match-system.appspot.com",
    messagingSenderId: "256004263719",
    appId: "1:256004263719:web:b65b23a88a460fb7b46302",
    measurementId: "G-BRYF476RH9"
};

firebase.initializeApp(config);

//for cache in reads
firebase.firestore().enablePersistence({ synchronizeTabs: true }).catch(function (err) {
    console.log(err);
    if (err.code === 'failed-precondition') {
        // Multiple tabs open, persistence can only be enabled
        // in one tab at a a time.
    } else if (err.code === 'unimplemented') {
        // The current browser does not support all of the
        // features required to enable persistence
    }
});

export default firebase;