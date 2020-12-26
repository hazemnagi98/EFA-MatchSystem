import React, { useState, useEffect } from 'react';
import { Row, Col, Container, Table, Button } from 'reactstrap';
import firebase from '../firebase';
import AdminLogin from './AdminLogin/AdminLogin';
const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
        setUsers([]);
        if (authenticated) {
            const unsubscribe = firebase.firestore().collection('users').onSnapshot(querySnapshot => {
                setUsers([]);
                if (!querySnapshot.empty) {
                    querySnapshot.forEach(doc => {
                        if (doc.exists) {
                            if (doc.data().role !== 'admin')
                                setUsers(prev => {
                                    return [...prev, doc.data()];
                                })
                        }
                    })
                }
            })
            return unsubscribe;
        }
    }, [authenticated])

    const activeUsers = [];
    users.forEach(user => {
        if (user.status === 'active')
            activeUsers.push(user);
    })
    const pendingUsers = [];
    users.forEach(user => {
        if (user.status === 'pending')
            activeUsers.push(user);
    })

    const handleActivate = async (user) => {
        try {
            const userDoc = await firebase.firestore().collection('users').where('email', '==', user.email).get();
            if (!userDoc.empty) {
                await firebase.firestore().collection('users').doc(userDoc.docs[0].id).update({
                    status: 'active'
                });
            }
        }
        catch (error) {
            console.log(error);
        }
    }
    const handleDelete = async (user) => {
        try {
            const userDoc = await firebase.firestore().collection('users').where('email', '==', user.email).get();
            if (!userDoc.empty) {
                await firebase.firestore().collection('users').doc(userDoc.docs[0].id).delete();
            }
        }
        catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            {
                authenticated ?
                    <Container>
                        <Row>
                            <Col>
                                <h5 className='m-4' style={{ textAlign: 'center' }}>Active Users</h5>
                                <Table style={{ backgroundColor: 'white' }} bordered>
                                    <tbody>
                                        <tr>
                                            <th>
                                                #
                                        </th>
                                            <th>
                                                Email
                                        </th>
                                            <th>
                                                Role
                                        </th>
                                            <th>
                                                Delete
                                        </th>
                                        </tr>
                                        {activeUsers.map((user, index) => {
                                            return <React.Fragment key={index}>
                                                <tr>
                                                    <td>{index + 1}</td>
                                                    <td>{user.email}</td>
                                                    <td>{user.role}</td>
                                                    <td><Button size='sm' color='danger' outline onClick={() => handleDelete(user)} >Delete</Button></td>
                                                </tr>
                                            </React.Fragment>
                                        })}
                                        {activeUsers.length === 0 ? <tr>
                                            <td colSpan='4' style={{ textAlign: 'center' }}>No active users</td>
                                        </tr> : null}
                                    </tbody>
                                </Table>
                            </Col>
                            <Col>
                                <h5 className='m-4' style={{ textAlign: 'center' }}>Pending Managers</h5>
                                <Table style={{ backgroundColor: 'white' }} bordered>
                                    <tbody>
                                        <tr>
                                            <th>
                                                #
                                            </th>
                                            <th>
                                                Email
                                            </th>
                                            <th>
                                                Activate
                                            </th>
                                            <th>
                                                Delete
                                            </th>
                                        </tr>
                                        {pendingUsers.map((user, index) => {
                                            return <React.Fragment key={index}>
                                                <tr>
                                                    <td>{index + 1}</td>
                                                    <td>{user.email}</td>
                                                    <td><Button size='sm' color='success' onClick={() => handleActivate(user)} outline>Activate</Button></td>
                                                    <td><Button size='sm' color='danger' onClick={() => handleDelete(user)} outline>Delete</Button></td>
                                                </tr>
                                            </React.Fragment>
                                        })}
                                        {pendingUsers.length === 0 ? <tr>
                                            <td colSpan='4' style={{ textAlign: 'center' }}>No pending managers</td>
                                        </tr> : null}
                                    </tbody>
                                </Table>
                            </Col>
                        </Row>
                    </Container> :
                    <AdminLogin setAuthenticated={setAuthenticated} />
            }
        </>
    )
}
export default AdminDashboard;