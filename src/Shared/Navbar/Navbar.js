import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, NavLink, NavbarBrand, NavItem, Button } from 'reactstrap';
import classes from './Navbar.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt, faUserPlus, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import firebase from '../../firebase';
import { AuthContext } from '../../Auth/Auth';
const NavBar = () => {
    const { currentUser } = useContext(AuthContext);
    const handleSignOut = async () => {
        await firebase.auth().signOut();
    }

    const signedOutNavbar = (<Navbar color='dark'>
        <NavbarBrand className={classes.NavLink}>EFA</NavbarBrand>
        <Nav style={{ textAlign: 'right' }}>
            <NavItem>
                <NavLink className={classes.NavLink} to='/signin' tag={Link}>
                    <FontAwesomeIcon icon={faSignInAlt} />{'  '}Sign In
            </NavLink>
            </NavItem>
            <NavItem>
                <NavLink className={classes.NavLink} to='/signup' tag={Link}>
                    <FontAwesomeIcon icon={faUserPlus} />{'  '}Sign Up
            </NavLink>
            </NavItem>
        </Nav>
    </Navbar>);

    const adminNavbar = (<Navbar color='dark'>
        <NavbarBrand className={classes.NavLink}>EFA - Admin</NavbarBrand>
        <Nav>
            <NavItem className={classes.NavLink}>
                User Management
            </NavItem>
        </Nav>
    </Navbar>)

    const managerNavbar = (
        <Navbar color='dark'>
            <NavbarBrand className={classes.NavLink}>EFA</NavbarBrand>
            <Nav style={{ textAlign: 'right' }}>
                <NavItem>
                    <NavLink className={classes.NavLink} to='/manager' tag={Link}>Home</NavLink>
                </NavItem>
                <NavItem>
                    <NavLink className={classes.NavLink} to='/manager/matches' tag={Link}>Matches</NavLink>
                </NavItem>
                <NavItem className={classes.NavLink}>
                    <Button onClick={handleSignOut} style={{ backgroundColor: 'transparent', border: 'none' }}><FontAwesomeIcon icon={faSignOutAlt} />{'  '}Sign Out</Button>
                </NavItem>
            </Nav>
        </Navbar>
    )
    if (currentUser === null)
        return signedOutNavbar;
    else if (currentUser.claims.role) {
        if (currentUser.claims.role === 'manager')
            return managerNavbar;
    }
    else if (!currentUser.claims.role)
        return adminNavbar;
}

export default NavBar;