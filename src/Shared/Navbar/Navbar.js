import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, NavLink, NavbarBrand, NavItem, Button, NavbarToggler, Collapse } from 'reactstrap';
import classes from './Navbar.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt, faUserPlus, faSignOutAlt, faFutbol, faUserEdit, faCalendarCheck, faHome, faUsersCog, faUnlock, faBars } from '@fortawesome/free-solid-svg-icons';
import firebase from '../../firebase';
import { AuthContext } from '../../Auth/Auth';
const NavBar = () => {
    const { currentUser } = useContext(AuthContext);
    const handleSignOut = async () => {
        setIsOpen(false);
        setIsFanOpen(false);
        setIsManagerOpen(false);
        setIsAdminOpen(false);
        await firebase.auth().signOut();
    }

    const [isOpen, setIsOpen] = useState(false);
    const [isAdminOpen, setIsAdminOpen] = useState(false);
    const [isManagerOpen, setIsManagerOpen] = useState(false);
    const [isFanOpen, setIsFanOpen] = useState(false);



    const toggle = () => setIsOpen(!isOpen);
    const toggleAdmin = () => setIsAdminOpen(!isAdminOpen);
    const toggleManager = () => setIsManagerOpen(!isManagerOpen);
    const toggleFan = () => setIsFanOpen(!isFanOpen);

    const signedOutNavbar = (
        <Navbar color='dark' expand='md'>
            <NavbarBrand className={classes.NavLink}>EFA</NavbarBrand>
            <NavbarToggler onClick={toggle} style={{ color: 'whitesmoke' }}>
                <FontAwesomeIcon icon={faBars} />
            </NavbarToggler>
            <Collapse isOpen={isOpen} navbar style={{ textAlign: 'right', flexDirection: 'row-reverse' }}>
                <Nav>
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
                    <NavItem>
                        <NavLink className={classes.NavLink} to='/home' tag={Link}>
                            <FontAwesomeIcon icon={faFutbol} />{'  '}Matches
            </NavLink>
                    </NavItem>
                </Nav>
            </Collapse>
        </Navbar>);

    const adminNavbar = (
        <Navbar color='dark' expand='md'>
            <NavbarBrand className={classes.NavLink}>EFA - Admin</NavbarBrand>
            <NavbarToggler onClick={toggleAdmin} style={{ color: 'whitesmoke' }}>
                <FontAwesomeIcon icon={faBars} />
            </NavbarToggler>
            <Collapse isOpen={isAdminOpen} navbar style={{ textAlign: 'right', flexDirection: 'row-reverse' }}>
                <Nav>
                    <NavItem className={classes.NavLink}>
                        <FontAwesomeIcon icon={faUsersCog} />{'  '}User Management
            </NavItem>
                </Nav>
            </Collapse>
        </Navbar>)

    const managerNavbar = (
        <Navbar color='dark' expand='md'>
            <NavbarBrand className={classes.NavLink}>EFA</NavbarBrand>
            <NavbarToggler onClick={toggleManager} style={{ color: 'whitesmoke' }}>
                <FontAwesomeIcon icon={faBars} />
            </NavbarToggler>
            <Collapse isOpen={isManagerOpen} navbar style={{ textAlign: 'right', flexDirection: 'row-reverse' }}>
                <Nav style={{ textAlign: 'right' }}>
                    <NavItem>
                        <NavLink className={classes.NavLink} to='/manager' tag={Link}><FontAwesomeIcon icon={faHome} />{'  '}Home</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink className={classes.NavLink} to='/manager/matches' tag={Link}><FontAwesomeIcon icon={faFutbol} />{'  '}Matches</NavLink>
                    </NavItem>
                    <NavItem className={classes.NavLink}>
                        <Button onClick={handleSignOut} style={{ backgroundColor: 'transparent', border: 'none' }}><FontAwesomeIcon icon={faSignOutAlt} />{'  '}Sign Out</Button>
                    </NavItem>
                </Nav>
            </Collapse>
        </Navbar>
    )
    const fanNavbar = (
        <Navbar color='dark' expand='md'>
            <NavbarBrand className={classes.NavLink}>EFA</NavbarBrand>
            <NavbarToggler onClick={toggleFan} style={{ color: 'whitesmoke' }}>
                <FontAwesomeIcon icon={faBars} />
            </NavbarToggler>
            <Collapse isOpen={isFanOpen} navbar style={{ textAlign: 'right', flexDirection: 'row-reverse' }}>
                <Nav style={{ textAlign: 'right' }}>
                    <NavItem>
                        <NavLink className={classes.NavLink} to='/me/changepassword' tag={Link}><FontAwesomeIcon icon={faUnlock} />{'  '}Change Password</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink className={classes.NavLink} to='/me/profile' tag={Link}><FontAwesomeIcon icon={faUserEdit} />{'  '}Edit Profile</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink className={classes.NavLink} to='/me/matches' tag={Link}><FontAwesomeIcon icon={faFutbol} />{'  '}Matches</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink className={classes.NavLink} to='/me/reservations' tag={Link}><FontAwesomeIcon icon={faCalendarCheck} />{'  '}Reservations</NavLink>
                    </NavItem>
                    <NavItem className={classes.NavLink}>
                        <Button onClick={handleSignOut} style={{ backgroundColor: 'transparent', border: 'none' }}><FontAwesomeIcon icon={faSignOutAlt} />{'  '}Sign Out</Button>
                    </NavItem>
                </Nav>
            </Collapse>
        </Navbar>
    )
    const unverifiedManagerNavbar = (
        <Navbar color='dark' expand='md'>
            <NavbarBrand className={classes.NavLink}>EFA</NavbarBrand>
            <NavbarToggler onClick={toggleManager} style={{ color: 'whitesmoke' }}>
                <FontAwesomeIcon icon={faBars} />
            </NavbarToggler>
            <Collapse isOpen={isManagerOpen} navbar style={{ textAlign: 'right', flexDirection: 'row-reverse' }}>
                <Nav style={{ textAlign: 'right' }}>
                    <NavItem className={classes.NavLink}>
                        <Button onClick={handleSignOut} style={{ backgroundColor: 'transparent', border: 'none' }}><FontAwesomeIcon icon={faSignOutAlt} />{'  '}Sign Out</Button>
                    </NavItem>
                </Nav>
            </Collapse>
        </Navbar>
    )

    if (currentUser === null)
        return signedOutNavbar;
    else if (currentUser.claims.role) {
        if (currentUser.claims.role === 'manager')
            return managerNavbar;
        if (currentUser.claims.role === 'fan')
            return fanNavbar;
    }
    else if (!currentUser.claims.role)
        return adminNavbar;
}

export default NavBar;