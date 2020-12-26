import React, { useEffect, useState } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Form, FormGroup, Input, Label } from 'reactstrap';
import firebase from '../../../firebase';
import DateTimePicker from 'react-datetime-picker';

const teams = ['Ahly', 'Zamalek', 'Ismaili', "Talaee'", 'Ghazl Al Mahalla', 'Haras', 'Aswan', 'El Gouna', 'Ceramica', 'Etisalat', 'FC Masr', 'Petrojet', 'Enppi', 'Etihad', 'El Masry', 'Asmant Asyout', 'El Bank El Ahly', 'El Intag'];

const CreateMatch = (props) => {
    const [stadiums, setStadiums] = useState([]);
    const [selectedHomeTeam, setSelectedHomeTeam] = useState('Ahly');
    const [selectedAwayTeam, setSelectedAwayTeam] = useState('Zamalek');
    const [date, setDate] = useState(new Date());

    useEffect(() => {
        const unsubscribe = firebase.firestore().collection('stadiums').onSnapshot(querySnapshot => {
            setStadiums([]);
            if (!querySnapshot.empty) {
                querySnapshot.forEach(doc => {
                    if (doc.exists)
                        setStadiums(prev => [...prev, doc.data()]);
                })
            }
        })
        return unsubscribe;
    }, [])

    const handleHomeSelectChange = e => {
        setSelectedHomeTeam(e.target.value);
    }

    const handleAwaySelectChange = e => {
        setSelectedAwayTeam(e.target.value);
    }

    const handleDateChange = date => {
        setDate(date);
    };

    const handleCreateMatch = async (e) => {
        e.preventDefault();
        const form = e.target;
        const homeTeam = form['homeTeam'].value;
        const awayTeam = form['awayTeam'].value;
        const referee = form['referee'].value;
        const firstLinesman = form['firstLinesman'].value;
        const secondLinesman = form['secondLinesman'].value;
        const stadium = form['stadium'].value;
        if (stadium !== '' && date !== null) {
            const stadiumObject = await firebase.firestore().collection('stadiums').where('name', '==', stadium).get();
            if (!stadiumObject.empty) {
                const seatsStatus = [];
                for (let i = 1; i <= stadiumObject.docs[0].data().numberOfRows; i++) {
                    for (let j = 1; j <= stadiumObject.docs[0].data().numberOfSeats; j++) {
                        seatsStatus.push({
                            row: i,
                            seat: j,
                            status: 'available'
                        })
                    }
                }
                await firebase.firestore().collection('matches').doc().set({
                    homeTeam: homeTeam,
                    awayTeam: awayTeam,
                    referee: referee,
                    stadium: stadium,
                    firstLinesman: firstLinesman,
                    secondLinesman: secondLinesman,
                    date: date,
                    name: homeTeam + ' vs ' + awayTeam,
                    seatsStatus: seatsStatus,
                    seatsPerRow: stadiumObject.docs[0].data().numberOfSeats
                })
            }

            form.reset();
            props.toggle();
        }
    }

    return (
        <>
            <Modal isOpen={props.modal} toggle={props.toggle}>
                <ModalHeader toggle={props.toggle}>Create Match</ModalHeader>
                <Form onSubmit={handleCreateMatch}>
                    <ModalBody>
                        <FormGroup>
                            <Label>
                                Home Team
                            </Label>
                            <Input type='select' name='homeTeam' onChange={handleHomeSelectChange}>
                                {teams.filter(team => team !== selectedAwayTeam).map((team, index) => {
                                    return <option key={index}>{team}</option>
                                })}
                            </Input>
                        </FormGroup>
                        <FormGroup>
                            <Label>
                                Away Team
                            </Label>
                            <Input type='select' name='awayTeam' onChange={handleAwaySelectChange}>
                                {teams.filter(team => team !== selectedHomeTeam).map((team, index) => {
                                    return <option key={index}>{team}</option>
                                })}
                            </Input>
                        </FormGroup>
                        <FormGroup>
                            <Label style={{ display: 'block' }}>Match Date</Label>
                            <DateTimePicker
                                onChange={handleDateChange}
                                value={date}
                                disableClock></DateTimePicker>
                        </FormGroup>
                        <FormGroup>
                            <Label>
                                Stadium
                            </Label>
                            <Input type='select' name='stadium' onChange={handleAwaySelectChange}>
                                {stadiums.map((stadium, index) => {
                                    return <option key={index}>{stadium.name}</option>
                                })}
                            </Input>
                        </FormGroup>
                        <FormGroup>
                            <Label>
                                Referee
                            </Label>
                            <Input type='text' name='referee' placeholder='Enter Referee Name' required />
                        </FormGroup>
                        <FormGroup>
                            <Label>
                                First Linesman
                            </Label>
                            <Input type='text' name='firstLinesman' placeholder='Enter First Linesman Name' required />
                        </FormGroup>
                        <FormGroup>
                            <Label>
                                Second Linesman
                            </Label>
                            <Input type='text' name='secondLinesman' placeholder='Enter Second Linesman Name' required />
                        </FormGroup>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="success" type='submit'>Create</Button>{' '}
                        <Button color="warning" onClick={props.toggle}>Cancel</Button>
                    </ModalFooter>
                </Form>
            </Modal>
        </>
    )
}
export default CreateMatch;