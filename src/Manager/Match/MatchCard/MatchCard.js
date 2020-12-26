import React, { useState, useEffect, useContext } from 'react';
import { useParams, Redirect } from 'react-router-dom';
import { Container, Row, Col, Card, CardHeader, CardBody, CardText, CardFooter, Button } from 'reactstrap';
import firebase from '../../../firebase';
import { AuthContext } from '../../../Auth/Auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChair } from '@fortawesome/free-solid-svg-icons';
import EditMatch from './EditMatch/EditMatch';
const MatchCard = () => {
    const matchID = useParams()['id'];
    const [match, setMatch] = useState(null);
    const [editMatchModal, setEditMatchModal] = useState(false);

    const toggleEditMatch = () => setEditMatchModal(!editMatchModal);
    const { currentUser } = useContext(AuthContext);
    useEffect(() => {

        const unsubscribe = firebase.firestore().collection('matches').doc(matchID).onSnapshot(doc => {
            if (doc.exists) {
                setMatch(doc.data());
            }
        })

        return unsubscribe;
    }, [matchID])

    if (match === null)
        return <div></div>
    if (currentUser === null)
        return <Redirect to='/signup' />

    return (
        <Container className='p-4'>
            <EditMatch
                toggle={toggleEditMatch}
                modal={editMatchModal}
                match={match}
            />
            <Row>
                <Col className='p-0 mb-4'>
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
                        <CardFooter className='text-center'>
                            <Button outline color='success' onClick={toggleEditMatch}>
                                Edit
                            </Button>
                        </CardFooter>
                    </Card>
                </Col>
            </Row>
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
        </Container>
    )
}
export default MatchCard;