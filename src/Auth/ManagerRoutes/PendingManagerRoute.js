import React, { useContext, useEffect, useState } from "react";
import { Route, Redirect } from "react-router-dom";
import Loading from "../../Shared/Loading/Loading";
import { AuthContext } from "../Auth";
import firebase from '../../firebase';

const PendingManagerRoute = ({ children: RouteComponents, ...rest }) => {
    const { currentUser } = useContext(AuthContext);
    const [userDoc, setUserDoc] = useState(null);

    useEffect(() => {
        if (currentUser) {
            const unsubscribe = firebase.firestore().collection('users').doc(currentUser.uid).onSnapshot((doc) => {
                if (doc.exists) {
                    setUserDoc(doc.data());
                }
            })
            return unsubscribe;
        }
    }, [currentUser])
    let access = false;
    if (currentUser && typeof currentUser.claims !== "undefined") {
        if (currentUser.claims.role === "manager" === true) {
            access = true
        }
    }
    if (userDoc) {
        if (currentUser && typeof currentUser.claims !== "undefined") {
            if (currentUser.claims.role === 'manager' && userDoc.status !== 'pending')
                return <Redirect to={"/manager"} />
        }
    }
    if (!userDoc) {
        return <Loading />
    }
    return (
        <Route {...rest} >
            {access ? RouteComponents : <Redirect to={"/"} />}
        </Route>
    );
};


export default PendingManagerRoute;