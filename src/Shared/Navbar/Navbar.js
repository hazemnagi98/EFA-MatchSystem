import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, NavLink, NavbarBrand, NavItem } from 'reactstrap';
import classes from './Navbar.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt, faUserPlus } from '@fortawesome/free-solid-svg-icons';
const NavBar = () => {
    const adminNavbar = (<Navbar color='dark'>
        <NavbarBrand className={classes.NavLink}>EFA - Admin</NavbarBrand>
        <Nav>
            <NavItem className={classes.NavLink}>
                User Management
            </NavItem>
        </Nav>
    </Navbar>)
    if (window.location.pathname === '/admin')
        return adminNavbar;
    return (

        <Navbar color='dark'>
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
        </Navbar>
    )
}

export default NavBar;