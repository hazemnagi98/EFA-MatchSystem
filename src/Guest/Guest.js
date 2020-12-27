import React, { useState, useEffect, useContext } from 'react';
import { Row, Col, Container, ListGroup, ListGroupItem, UncontrolledCollapse, Button, ListGroupItemHeading, Card, CardBody, CardHeader, CardText } from 'reactstrap';
import firebase from '../firebase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChair } from '@fortawesome/free-solid-svg-icons';
import { AuthContext } from '../Auth/Auth';
import { Redirect } from 'react-router-dom';
const Guest = () => {
    const { currentUser } = useContext(AuthContext);

    const [matches, setMatches] = useState([]);
    useEffect(() => {
        setMatches([]);
        const unsubscribe = firebase.firestore().collection('matches').onSnapshot(querySnapshot => {
            if (!querySnapshot.empty) {
                querySnapshot.forEach(doc => {
                    if (doc.exists) {
                        setMatches(prev => [...prev, doc.data()]);
                    }
                })
            }
        })
        return unsubscribe
    }, []);

    if (currentUser)
        if (currentUser.claims.role === 'manager')
            return <Redirect to='/manager' />
        else if (currentUser.claims.role === 'fan')
            return <Redirect to='/fan' />
        else
            return <Redirect to='/' />

    const list = matches.map((match, index) => {
        return (
            <ListGroupItem key={index}>
                <Button block color="primary" id={`toggler${index + 1}`} style={{ marginBottom: '1rem' }}>
                    {match.name}
                </Button>
                <UncontrolledCollapse toggler={`toggler${index + 1}`}>
                    <Card>
                        <CardHeader>{match.name}</CardHeader>
                        <CardBody>
                            <CardText>
                                Home Team: {match.homeTeam}
                            </CardText>
                            <CardText>
                                Away Team: {match.awayTeam}
                            </CardText>
                            <CardText>
                                Stadium: {match.stadium}
                            </CardText>
                            <CardText>
                                Referee: {match.referee}
                            </CardText>
                            <CardText>
                                First Linesman: {match.firstLinesman}
                            </CardText>
                            <CardText>
                                Second Linesman: {match.secondLinesman}
                            </CardText>
                            <CardText>
                                Date: {match.date.toDate().toLocaleDateString()}
                            </CardText>
                        </CardBody>
                    </Card>
                    <Row>
                        <Col className='p-4' style={{ backgroundColor: 'white' }}>
                            <h5 className='text-center'>Seating</h5>
                            <hr />
                            <div className='m-auto' style={{ width: 40 * match.seatsPerRow + 'px', maxWidth: '100%' }}>
                                {match.seatsStatus.map((seat, index) => {
                                    return (
                                        <React.Fragment key={index}>
                                            <div style={{ display: 'inline-block' }} >
                                                <FontAwesomeIcon style={{ width: '30px', height: '30px', display: 'inline-block', margin: '5px', color: seat.status === 'available' ? 'green' : 'red' }} icon={faChair}></FontAwesomeIcon>
                                            </div>
                                        </React.Fragment>
                                    )
                                })}
                            </div>
                        </Col>
                    </Row>
                </UncontrolledCollapse>
            </ListGroupItem>
        )
    })
    return (
        <Container>
            <Row>
                <Col>
                    <ListGroup>
                        <ListGroupItemHeading className='text-center mt-4'>
                            Matches
                        </ListGroupItemHeading>
                        {list}
                    </ListGroup>
                </Col>
            </Row>

        </Container>
    )
}

export default Guest;