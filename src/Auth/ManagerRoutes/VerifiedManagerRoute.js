import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import { AuthContext } from "../Auth";
import firebase from '../../firebase';
const VerifiedManagerRoute = ({ children: RouteComponents, ...rest }) => {
    const { currentUser, userInfo } = useContext(AuthContext);
    let access = false;
    console.log(userInfo);
    if (!userInfo) {
        firebase.auth().signOut().then(() => {
            return <Redirect to='/signin' />
        });
    }
    if (currentUser && typeof currentUser.claims !== "undefined") {
        if (currentUser.claims.role === "manager" === true) {
            access = true
        }
    }

    if (currentUser && typeof currentUser.claims !== "undefined" && userInfo.status !== 'active') {
        if (currentUser.claims.role === 'manager')
            return <Redirect to={"/pending"} />
    }
    return (
        <Route {...rest} >
            {access ? RouteComponents : <Redirect to={"/"} />}
        </Route>
    );
};


export default VerifiedManagerRoute;