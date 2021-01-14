import React, { useState, useEffect, useContext } from 'react';
import { Row, Col, Container, ListGroup, ListGroupItem, Button, Modal, ModalHeader, ModalBody, ModalFooter, ListGroupItemHeading, ListGroupItemText } from 'reactstrap';
import firebase from '../../firebase';
import { AuthContext } from '../../Auth/Auth';
import { Redirect } from 'react-router-dom';

const Reservations = () => {
    const [reservations, setReservations] = useState([]);
    const { currentUser } = useContext(AuthContext);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedReservation, setSelectedReservation] = useState(null);
    const toggle = () => setIsOpen(!isOpen);
    useEffect(() => {
        if (currentUser) {
            const unsubscribe = firebase.firestore().collection('users').doc(currentUser.uid).onSnapshot((querySnapshot) => {
                if (querySnapshot.exists) {
                    if (querySnapshot.data().reservations)
                        setReservations(querySnapshot.data().reservations);
                }
            })
            return unsubscribe;
        }
    }, [currentUser])
    const handleCancelReservation = async (reservation) => {
        try {
            toggle();
            await firebase.firestore().collection('users').doc(currentUser.uid).update({
                reservations: firebase.firestore.FieldValue.arrayRemove(reservation)
            })
            const match = await firebase.firestore().collection('matches').doc(reservation.matchID).get();
            const seatsStatus = [...match.data().seatsStatus];
            const index = seatsStatus.findIndex(seat => seat.row === reservation.seat.row && seat.seat === reservation.seat.seat);
            seatsStatus[index].status = 'available';
            await firebase.firestore().collection('matches').doc(reservation.matchID).update({
                seatsStatus: seatsStatus
            })
        }
        catch (error) {
            console.log(error);
        }
    }

    const handleConfirmCancel = async () => {
        await handleCancelReservation(selectedReservation);
        toggle();
    }

    const handleSetCancel = (reservation) => {
        setSelectedReservation(reservation);
        toggle();
    }
    const reservationsList = [];
    reservations.forEach(reservation => {
        if (reservation.matchDate.toDate() > new Date())
            reservationsList.push(
                <Col lg={4} md={6} sm={12} className='p-2' style={{ borderRadius: '10px' }}>
                    <ListGroupItem>
                        <ListGroupItemHeading className='text-center'>
                            {reservation.matchName}
                        </ListGroupItemHeading>
                        <ListGroupItem>
                            <ListGroupItemText>
                                Date: {reservation.matchDate.toDate().toLocaleDateString()}
                            </ListGroupItemText>
                            <ListGroupItemText>
                                Seat:
                            </ListGroupItemText>
                            <ListGroupItemText>
                                Row: {reservation.seat.row}
                            </ListGroupItemText>
                            <ListGroupItemText>
                                Seat: {reservation.seat.seat}
                            </ListGroupItemText>
                            <Button block outline color='danger' onClick={() => handleSetCancel(reservation)}>Cancel Reservation</Button>
                        </ListGroupItem>

                    </ListGroupItem>

                </Col>
            )
    })
    if (!currentUser) {
        return <Redirect to='/signin' />
    }
    const modal = <Modal isOpen={isOpen} toggle={toggle}>
        <ModalHeader>
            Confirm
        </ModalHeader>
        <ModalBody>
            Are you sure you want to cancel your reservation ?
        </ModalBody>
        <ModalFooter className="text-right">
            <Button onClick={toggle}>Cancel</Button>
            <Button onClick={handleConfirmCancel}>Confirm</Button>
        </ModalFooter>
    </Modal>
    return (
        <Container fluid className='p-4' style={{ paddingTop: '10px !important' }}>
            {modal}
            <ListGroup>
                <Row className='m-0'>
                    <Col lg={12} className='p-2 mt-3' style={{ backgroundColor: 'lightblue', borderRadius: '15px' }}>
                        <ListGroupItemHeading className="text-center">
                            Your Reservations
                </ListGroupItemHeading>
                    </Col>
                    <Col lg={12}>
                        <Row className='m-0 mt-2' style={{ backgroundColor: 'lightblue', borderRadius: '15px' }}>
                            {reservationsList}
                        </Row>
                    </Col>
                </Row>

            </ListGroup>
        </Container>
    )
}

export default Reservations;