import firebase from '../../firebase';
import React, { useState, useContext } from 'react';
import { Container, Row, Col, Form, FormGroup, Input, Label, Button, Alert } from 'reactstrap';
import Loading from '../../Shared/Loading/Loading';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { AuthContext } from '../Auth';
import { Redirect } from 'react-router-dom';
const SignUp = props => {
    const { currentUser, userInfo } = useContext(AuthContext);
    const [pending, setPending] = useState(false);
    const [warning, setWarning] = useState(null);
    const signUp = firebase.functions().httpsCallable('userManagement-addUser');
    const [date, setDate] = useState(null);

    const handleDateChange = date => {
        setDate(date);
    };

    const handleSignUp = async (e) => {
        e.persist();
        e.preventDefault();
        const form = e.target;
        const firstName = form['firstName'].value;
        const lastName = form['lastName'].value;
        const email = form['email'].value;
        const password = form['password'].value;
        const confirmPassword = form['confirmPassword'].value;
        const address = form['address'].value;
        const gender = form['gender'].value;
        const city = form['city'].value;
        const role = form['role'].value;
        const status = role === 'fan' ? 'active' : 'pending';
        if (password === confirmPassword && date !== null) {
            try {
                setPending(true);
                await firebase.auth().createUserWithEmailAndPassword(email, password)
                try {
                    await signUp({
                        email: email,
                        firstName: firstName,
                        lastName: lastName,
                        gender: gender,
                        address: address,
                        city: city,
                        role: role,
                        status: status,
                        dateOfBirth: firebase.firestore.Timestamp.fromDate(date)
                    })
                }
                catch (error) {
                    console.log(error);
                }
                await firebase.auth().currentUser.getIdToken(true);
                if (role === 'manager')
                    window.location = '/manager';
                else
                    window.location = '/me/matches';
            }
            catch (error) {
                setWarning(<Alert color='danger'>Email Already Exists</Alert>)
                setPending(false);
            }
        }
    }
    if (currentUser)
        if (currentUser.claims.role) {
            if (currentUser.claims.role === 'manager')
                return <Redirect to='/manager' />
            else if (currentUser.claims.role === 'fan')
                return <Redirect to='/me/matches' />
        }
        else {
            if (userInfo) {
                if (userInfo.email === 'admin@gmail.com')
                    return <Redirect to='/admin' />
                else
                    return <Loading />
            }
        }

    if (pending)
        return <Loading />
    return (
        <Container fluid >

            <Row className='m-0 mt-4 mb-4'>
                <Col className='p-3' lg={{ size: 8, offset: 2 }} md={12} sm={12} style={{ backgroundColor: 'lightblue', borderRadius: '20px' }}>
                    <h5>Sign Up</h5>
                    <hr />
                    {warning}
                    <Form name='signup' onSubmit={e => handleSignUp(e)}>
                        <FormGroup>
                            <Label>
                                Email
                            </Label>
                            <Input type="email" name='email' placeholder="Enter Your Email" required />
                        </FormGroup>
                        <FormGroup>
                            <Label>
                                Password
                            </Label>
                            <Input type="password" name='password' placeholder="Enter Your Password" required />
                        </FormGroup>
                        <FormGroup>
                            <Label>
                                Confirm Password
                            </Label>
                            <Input type="password" name='confirmPassword' placeholder="Enter Your Password Again" required />
                        </FormGroup>
                        <FormGroup>
                            <Label>
                                First Name
                            </Label>
                            <Input type="text" name='firstName' placeholder="Enter Your First Name" required />
                        </FormGroup>
                        <FormGroup>
                            <Label>
                                Last Name
                            </Label>
                            <Input type="text" name='lastName' placeholder="Enter Your Last Name" required />
                        </FormGroup>
                        <FormGroup>
                            <Label style={{ display: 'block' }}>Date of Birth</Label>
                            <Calendar
                                onChange={handleDateChange}
                                value={date}></Calendar>
                        </FormGroup>
                        <Label style={{ display: 'block' }}>
                            Gender
                        </Label>
                        <FormGroup check>
                            <Label check>
                                <Input type="radio" name="gender" value="male" required />{' '}
                                 Male
                            </Label>
                        </FormGroup>
                        <FormGroup check>
                            <Label check>
                                <Input type="radio" name="gender" value="female" required />{' '}
                                Female
                            </Label>
                        </FormGroup>
                        <FormGroup>
                            <Label>
                                Address
                            </Label>
                            <Input type="text" name='address' placeholder="Enter Your Address" />
                        </FormGroup>
                        <FormGroup>
                            <Label>
                                City
                            </Label>
                            <Input type="text" name='city' placeholder="Enter Your City" required />
                        </FormGroup>


                        <Label style={{ display: 'block' }}>
                            You are signing up as:
                        </Label>
                        <FormGroup check>
                            <Label check>
                                <Input type="radio" name="role" value='fan' required />{' '}
                                 Fan
                            </Label>
                        </FormGroup>
                        <FormGroup check>
                            <Label check>
                                <Input type="radio" name="role" value='manager' required />{' '}
                                Manager
                            </Label>
                        </FormGroup>

                        <FormGroup style={{ textAlign: 'right' }}>
                            <Button outline color='primary' type='submit'>
                                Sign Up
                            </Button>
                        </FormGroup>
                    </Form>
                </Col>
            </Row>
        </Container>
    )

}

export default SignUp;