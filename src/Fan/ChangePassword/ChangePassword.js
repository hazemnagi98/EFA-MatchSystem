import React, { useState } from 'react';
import { Form, FormGroup, Row, Col, Container, Label, Button, Input, Alert } from 'reactstrap';
import firebase from '../../firebase';

const ChangePassword = () => {


    const [passwordWarning, setPasswordWarning] = useState(null);

    const [password, setPassword] = useState(null);
    const [confirmPassword, setConfirmPassword] = useState(null);
    const [currentPassword, setCurrentPassword] = useState(null);

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setPasswordWarning(<Alert color='danger'>Password and confirm password dont match</Alert>);
            return;
        }
        if (password === currentPassword) {
            setPasswordWarning(<Alert color='danger'>Use a new password</Alert>);
            return;
        }
        const user = firebase.auth().currentUser;
        const credential = firebase.auth.EmailAuthProvider.credential(
            firebase.auth().currentUser.email,
            currentPassword
        );

        try {
            await user.reauthenticateWithCredential(credential);
            await user.updatePassword(password);
            setPasswordWarning(<Alert color='success'>Updated Successfully</Alert>);
            setPassword('');
            setCurrentPassword('');
            setConfirmPassword('');
        }
        catch (error) {
            setPasswordWarning(<Alert color='danger'>Invalid Password</Alert>)
        }
    }

    const handleChange = (e) => {
        switch (e.target.name) {
            case 'password':
                setPassword(e.target.value)
                break;
            case 'currentPassword':
                setCurrentPassword(e.target.value);
                break;
            case 'confirmPassword':
                setConfirmPassword(e.target.value);
                break;
            default: return;
        }
    }
    return (
        <Container>
            <Row>
                <Col style={{ backgroundColor: 'white', borderRadius: '20px' }} className='p-4 m-3'>
                    <h5>Change Password</h5>
                    <hr />
                    {passwordWarning}
                    <Form name='update' onSubmit={e => handleUpdatePassword(e)}>
                        <FormGroup>
                            <Label>
                                Current Password
                            </Label>
                            <Input type="password" name='currentPassword' value={currentPassword || ''} onChange={handleChange} placeholder="Enter Your Current Password" required />
                        </FormGroup>
                        <FormGroup>
                            <Label>
                                New Password
                            </Label>
                            <Input type="password" name='password' value={password || ''} onChange={handleChange} placeholder="Enter Your New Password" required />
                        </FormGroup>
                        <FormGroup>
                            <Label>
                                Confirm New Password
                            </Label>
                            <Input type="password" name='confirmPassword' value={confirmPassword || ''} onChange={handleChange} placeholder="Enter Your New Password Again" required />
                        </FormGroup>

                        <FormGroup style={{ textAlign: 'right' }}>
                            <Button outline color='primary' type='submit'>
                                Save
                            </Button>
                        </FormGroup>
                    </Form>
                </Col>
            </Row>
        </Container>)
}

export default ChangePassword;