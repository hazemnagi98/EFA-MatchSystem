import React, { useEffect, useState, useContext } from 'react';
import firebase from '../../../firebase';
import { Table, Row, Col, Container } from 'reactstrap';
import { Link, Redirect } from 'react-router-dom';
import { AuthContext } from '../../../Auth/Auth';

const ViewMatches = () => {
    const [matches, setMatches] = useState([]);
    const { currentUser } = useContext(AuthContext);

    useEffect(() => {
        firebase.firestore().collection('matches').onSnapshot(querySnapshot => {
            setMatches([]);
            if (!querySnapshot.empty) {
                querySnapshot.forEach(doc => {
                    if (doc.exists) {
                        setMatches(prev => [...prev, { id: doc.id, data: doc.data() }]);
                    }
                })
            }
        })
    }, [])
    if (currentUser === null)
        return <Redirect to='/signup' />
    return (
        <Container className='p-4'>
            <Row>
                <Col>

                    <Table bordered style={{ backgroundColor: 'white' }}>
                        <tbody>
                            <tr>
                                <th>
                                    Match Name
                                </th>
                            </tr>
                            {matches.map((match, index) => {
                                return <tr key={index}>
                                    <td>
                                        <Link to={`/manager/matches/${match.id}`}>{match.data.name}</Link>
                                    </td>
                                </tr>
                            })}
                            {matches.length === 0 ? <tr>
                                <td>
                                    <h5>No Matches Yet!</h5>
                                </td>
                            </tr> : null}

                        </tbody>
                    </Table>
                </Col>
            </Row>
        </Container>
    )
}
export default ViewMatches