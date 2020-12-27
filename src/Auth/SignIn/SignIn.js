import React, { useContext, useState } from 'react';
import { Redirect } from 'react-router';
import { Container, Row, Col, Form, Input, FormGroup, Button, Label, Alert } from 'reactstrap';
import firebase from '../../firebase';
import { AuthContext } from '../Auth';
const SignIn = () => {
    const { currentUser } = useContext(AuthContext);
    const [warning, setWarning] = useState(null);
    const handleSignIn = async (e) => {
        e.preventDefault();
        const form = e.target;
        const email = form['email'].value;
        const password = form['password'].value;
        try {
            await firebase.auth().signInWithEmailAndPassword(email, password);
        }
        catch (error) {
            setWarning(<Alert color='danger'>Email does not exist</Alert>)
        }
    }
    if (currentUser)
        if (currentUser.claims.role === 'manager')
            return <Redirect to='/manager' />
        else if (currentUser.claims.role === 'fan')
            return <Redirect to='/me/matches' />
    return (
        <Container fluid >
            <Row className='m-0 mt-4 mb-4'>
                <Col className='p-3' lg={{ size: 8, offset: 2 }} md={12} sm={12} style={{ backgroundColor: 'lightblue', borderRadius: '20px' }}>
                    <h5>Sign In</h5>
                    <hr />
                    {warning}
                    <Form name='signup' onSubmit={e => handleSignIn(e)}>
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

                        <FormGroup style={{ textAlign: 'right' }}>
                            <Button outline color='primary' type='submit'>
                                Sign In
                            </Button>
                        </FormGroup>
                    </Form>
                </Col>
            </Row>
        </Container>
    )
}
export default SignIn;