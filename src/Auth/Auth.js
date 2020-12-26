import React, { useState, useEffect } from 'react';
import firebase from '../firebase';
import Loading from '../Shared/Loading/Loading'

export const AuthContext = React.createContext();
export const AuthProvider = ({ children }) => {

    const [currentUser, setCurrentUser] = useState(null);
    const [userInfo, setUserInfo] = useState(null);
    const [pending, setPending] = useState(true);

    useEffect(() => {
        const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                user.getIdTokenResult().then(idTokenResult => {
                    console.log(idTokenResult.claims);
                    user.claims = idTokenResult.claims;
                    setCurrentUser(user);
                })
            }
            else {
                setCurrentUser(null);
                setPending(false);
            }

        });
        return () => {
            unsubscribe();
        }
    }, []);

    useEffect(() => {
        if (currentUser) {
            const unsubscribe = firebase.firestore().collection('users').doc(currentUser.uid).onSnapshot(querySnapshot => {
                setUserInfo(querySnapshot.data());
                setPending(false);
            });
            return unsubscribe;
        }
    }, [currentUser]);

    if (pending) {
        return <Loading />
    }

    return (
        <AuthContext.Provider value={{ currentUser, userInfo }}>
            {children}
        </AuthContext.Provider>
    );
};