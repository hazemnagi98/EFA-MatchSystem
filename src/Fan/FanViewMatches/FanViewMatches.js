import React, { useState, useEffect, useContext } from 'react';
import { Row, Col, Container, ListGroup, ListGroupItem, UncontrolledCollapse, Button, ListGroupItemHeading, Card, CardBody, CardHeader, CardText } from 'reactstrap';
import firebase from '../../firebase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChair } from '@fortawesome/free-solid-svg-icons';
import { AuthContext } from '../../Auth/Auth';
import { Redirect } from 'react-router-dom';
const FanViewMatches = () => {
    const { currentUser, userInfo } = useContext(AuthContext);
    const [matches, setMatches] = useState([]);
    useEffect(() => {
        setMatches([]);
        const unsubscribe = firebase.firestore().collection('matches').onSnapshot(querySnapshot => {
            if (!querySnapshot.empty) {
                const matches = []
                querySnapshot.forEach(doc => {
                    if (doc.exists) {
                        if (doc.data().date.toDate() > new Date())
                            matches.push({ id: doc.id, data: doc.data() })
                    }
                })
                setMatches(matches);
            }
        })
        return unsubscribe;
    }, []);

    if (currentUser) {
        if (currentUser.claims.role === 'manager')
            return <Redirect to='/manager' />
    }
    else
        return <Redirect to='/signin' />
    if (currentUser.claims.role !== 'fan')
        return <Redirect to='/' />

    const handleReserveSeat = async (match, index) => {
        const newMatch = { ...match }

        newMatch.data.seatsStatus[index] = {
            ...match.data.seatsStatus[index],
            status: 'reserved'
        }

        let clash = false;

        userInfo.reservations.forEach(reservation => {
            if (reservation.date.toDate().toLocaleString() === match.data.date.toDate().toLocaleString()
                && reservation.matchID !== match.id) {
                clash = true;
                return;
            }
        })

        if (clash)
            return alert('Cannot Make Reservation, clash detected');

        await firebase.firestore().runTransaction(async transaction => {
            const matchDocRef = firebase.firestore().collection('matches').doc(match.id);
            const userDoc = firebase.firestore().collection('users').doc(currentUser.uid);

            transaction.update(matchDocRef, {
                ...newMatch.data
            });

            transaction.update(userDoc, {
                reservations: firebase.firestore.FieldValue.arrayUnion({
                    matchID: match.id,
                    seat: newMatch.data.seatsStatus[index],
                    date: match.data.date
                })
            })
        })

    }
    const list = matches.map((match, index) => {
        return (
            <ListGroupItem key={index}>
                <Button block color="primary" id={`toggler${index + 1}`} style={{ marginBottom: '1rem' }}>
                    {match.data.name}
                </Button>
                <UncontrolledCollapse toggler={`toggler${index + 1}`}>
                    <Card>
                        <CardHeader>{match.data.name}</CardHeader>
                        <CardBody>
                            <CardText>
                                Home Team: {match.data.homeTeam}
                            </CardText>
                            <CardText>
                                Away Team: {match.data.awayTeam}
                            </CardText>
                            <CardText>
                                Stadium: {match.data.stadium}
                            </CardText>
                            <CardText>
                                Referee: {match.data.referee}
                            </CardText>
                            <CardText>
                                First Linesman: {match.data.firstLinesman}
                            </CardText>
                            <CardText>
                                Second Linesman: {match.data.secondLinesman}
                            </CardText>
                            <CardText>
                                Date: {match.data.date.toDate().toLocaleDateString()}
                            </CardText>
                        </CardBody>
                    </Card>
                    <Row>
                        <Col className='p-4' style={{ backgroundColor: 'white' }}>
                            <h5 className='text-center'>Seating</h5>
                            <hr />
                            <div className='m-auto' style={{ width: 40 * match.data.seatsPerRow + 'px', maxWidth: '100%' }}>
                                {match.data.seatsStatus.map((seat, index) => {
                                    return (
                                        <React.Fragment key={index}>
                                            <div style={{ display: 'inline-block', cursor: seat.status === 'available' ? 'pointer' : 'initial' }} onClick={seat.status === 'available' ? () => handleReserveSeat(match, index) : null} >
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
                            Upcoming Matches
                        </ListGroupItemHeading>
                        {list}
                    </ListGroup>
                </Col>
            </Row>

        </Container>
    )
}

export default FanViewMatches;