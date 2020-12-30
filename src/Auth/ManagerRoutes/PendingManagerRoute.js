import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import { AuthContext } from "../Auth";

const PendingManagerRoute = ({ children: RouteComponents, ...rest }) => {
    const { currentUser, userInfo } = useContext(AuthContext);
    let access = false;
    if (currentUser && typeof currentUser.claims !== "undefined") {
        if (currentUser.claims.role === "manager" === true) {
            access = true
        }
    }

    if (currentUser && typeof currentUser.claims !== "undefined") {
        if (currentUser.claims.role === 'manager' && userInfo.status !== 'pending')
            return <Redirect to={"/manager"} />
    }
    return (
        <Route {...rest} >
            {access ? RouteComponents : <Redirect to={"/"} />}
        </Route>
    );
};


export default PendingManagerRoute;