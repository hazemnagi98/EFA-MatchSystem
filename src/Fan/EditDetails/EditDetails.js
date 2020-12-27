import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Form, FormGroup, Button, Input, Label, Alert } from 'reactstrap';
import firebase from '../../firebase';
import { Redirect } from 'react-router-dom';
import { AuthContext } from '../../Auth/Auth';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const EditDetails = () => {
    const { currentUser, userInfo } = useContext(AuthContext);
    const [firstName, setFirstName] = useState(null);
    const [lastName, setLastName] = useState(null);
    const [dateOfBirth, setDateOfBirth] = useState(null);
    const [city, setCity] = useState(null);
    const [address, setAddress] = useState(null);
    const [warning, setWarning] = useState(null);
    useEffect(() => {
        if (userInfo) {
            setFirstName(userInfo.firstName);
            setLastName(userInfo.lastName);
            setDateOfBirth(userInfo.dateOfBirth.toDate());
            setCity(userInfo.city);
            setAddress(userInfo.address);
        }
    }, [userInfo])
    if (!currentUser)
        return <Redirect to='/signin' />
    if (currentUser.claims) {
        if (currentUser.claims.role !== 'fan')
            return <Redirect to='/manager' />
    }
    else
        return <Redirect to='/admin' />

    const handleChange = (e) => {
        switch (e.target.name) {
            case 'firstName':
                setFirstName(e.target.value);
                break;
            case 'lastName':
                setLastName(e.target.value);
                break;
            case 'address':
                setAddress(e.target.value);
                break;
            case 'city':
                setCity(e.target.value);
                break;
            default: return;
        }
    }
    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        if (firstName.replace(/\s/g, '') !== '' && lastName.replace(/\s/g, '') !== '' && city.replace(/\s/g, '') !== '' && dateOfBirth < new Date()) {
            try {
                await firebase.firestore().collection('users').doc(currentUser.uid).update({
                    firstName: firstName,
                    lastName: lastName,
                    city: city,
                    dateOfBirth: dateOfBirth,
                    address: address
                })
                setWarning(<Alert color='success'>Updated Successfully</Alert>)
            }
            catch (error) {
                setWarning(<Alert color='danger'>An Error has Occurred, please try again later</Alert>)
            }
        }
        else {
            setWarning(<Alert color='danger'>Invalid inputs</Alert>)
        }

    }
    const handleDateChange = date => {
        setDateOfBirth(date);
    };

    return (
        <Container className='p-4'>
            <Row>
                <Col style={{ backgroundColor: 'white', borderRadius: '20px' }} className='p-4 m-3'>
                    <h5>Edit Profile</h5>
                    <hr />
                    {warning}
                    <Form name='update' onSubmit={e => handleUpdateProfile(e)}>
                        <FormGroup>
                            <Label>
                                First Name
                            </Label>
                            <Input type="text" name='firstName' value={firstName || ''} onChange={handleChange} placeholder="Enter Your First Name" required />
                        </FormGroup>
                        <FormGroup>
                            <Label>
                                Last Name
                            </Label>
                            <Input type="text" name='lastName' value={lastName || ''} onChange={handleChange} placeholder="Enter Your Last Name" required />
                        </FormGroup>
                        <FormGroup>
                            <Label style={{ display: 'block' }}>Date of Birth</Label>
                            <Calendar
                                onChange={handleDateChange}
                                value={dateOfBirth}></Calendar>
                        </FormGroup>
                        <FormGroup>
                            <Label>
                                Address
                            </Label>
                            <Input type="text" name='address' value={address || ''} onChange={handleChange} placeholder="Enter Your Address" />
                        </FormGroup>
                        <FormGroup>
                            <Label>
                                City
                            </Label>
                            <Input type="text" name='city' value={city || ''} onChange={handleChange} placeholder="Enter Your City" required />
                        </FormGroup>
                        <FormGroup style={{ textAlign: 'right' }}>
                            <Button outline color='primary' type='submit'>
                                Save
                            </Button>
                        </FormGroup>
                    </Form>
                </Col>
            </Row>
        </Container>
    )
}
export default EditDetails;