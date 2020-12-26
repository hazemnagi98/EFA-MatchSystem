import React, { useEffect, useState } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Form, FormGroup, Input, Label } from 'reactstrap';
import firebase from '../../../../firebase';
import DateTimePicker from 'react-datetime-picker';
import { useParams } from 'react-router-dom';
const teams = ['Ahly', 'Zamalek', 'Ismaili', "Talaee'", 'Ghazl Al Mahalla', 'Haras', 'Aswan', 'El Gouna', 'Ceramica', 'Etisalat', 'FC Masr', 'Petrojet', 'Enppi', 'Etihad', 'El Masry', 'Asmant Asyout', 'El Bank El Ahly', 'El Intag'];

const EditMatch = (props) => {
    const [stadiums, setStadiums] = useState([]);
    const [selectedHomeTeam, setSelectedHomeTeam] = useState(null);
    const [selectedAwayTeam, setSelectedAwayTeam] = useState(null);
    const [referee, setReferee] = useState(null);
    const [firstLinesman, setFirstLinesman] = useState(null);
    const [secondLinesman, setSecondLinesman] = useState(null);
    const [stadium, setStadium] = useState(null);
    const [date, setDate] = useState(new Date());
    const matchID = useParams()['id'];

    useEffect(() => {
        if (props.match) {
            setSelectedHomeTeam(props.match.homeTeam);
            setSelectedAwayTeam(props.match.awayTeam);
            setReferee(props.match.referee);
            setFirstLinesman(props.match.firstLinesman);
            setSecondLinesman(props.match.secondLinesman);
            setStadium(props.match.stadium);
            setDate(props.match.date.toDate());
        }
    }, [props.match])

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

    const handleStadiumSelectChange = e => {
        setStadium(e.target.value);
    }

    const handleRefereeChange = e => {
        setReferee(e.target.value);
    }

    const handleFirstLinesmanChange = e => {
        setFirstLinesman(e.target.value);
    }

    const handleSecondLinesmanChange = e => {
        setSecondLinesman(e.target.value);
    }

    const handleDateChange = date => {
        setDate(date);
    };

    const handleEditMatch = async (e) => {
        e.preventDefault();
        const form = e.target;
        const homeTeam = form['homeTeam'].value;
        const awayTeam = form['awayTeam'].value;
        const referee = form['referee'].value;
        const firstLinesman = form['firstLinesman'].value;
        const secondLinesman = form['secondLinesman'].value;
        const stadium = form['stadium'].value;
        if (stadium !== '' && date !== null && date < new Date()) {
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
                await firebase.firestore().collection('matches').doc(matchID).update({
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
                <ModalHeader toggle={props.toggle}>Edit Match</ModalHeader>
                <Form onSubmit={handleEditMatch}>
                    <ModalBody>
                        <FormGroup>
                            <Label>
                                Home Team
                            </Label>
                            <Input type='select' name='homeTeam' value={selectedHomeTeam || ''} onChange={handleHomeSelectChange}>
                                {teams.filter(team => team !== selectedAwayTeam).map((team, index) => {
                                    return <option key={index}>{team}</option>
                                })}
                            </Input>
                        </FormGroup>
                        <FormGroup>
                            <Label>
                                Away Team
                            </Label>
                            <Input type='select' name='awayTeam' value={selectedAwayTeam || ''} onChange={handleAwaySelectChange}>
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
                            <Input type='select' name='stadium' value={stadium || ''} onChange={handleStadiumSelectChange}>
                                {stadiums.map((stadium, index) => {
                                    return <option key={index}>{stadium.name}</option>
                                })}
                            </Input>
                        </FormGroup>
                        <FormGroup>
                            <Label>
                                Referee
                            </Label>
                            <Input type='text' name='referee' value={referee} onChange={handleRefereeChange} placeholder='Enter Referee Name' required />
                        </FormGroup>
                        <FormGroup>
                            <Label>
                                First Linesman
                            </Label>
                            <Input type='text' name='firstLinesman' value={firstLinesman} onChange={handleFirstLinesmanChange} placeholder='Enter First Linesman Name' required />
                        </FormGroup>
                        <FormGroup>
                            <Label>
                                Second Linesman
                            </Label>
                            <Input type='text' name='secondLinesman' value={secondLinesman} onChange={handleSecondLinesmanChange} placeholder='Enter Second Linesman Name' required />
                        </FormGroup>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="success" type='submit'>Save</Button>{' '}
                        <Button color="warning" onClick={props.toggle}>Cancel</Button>
                    </ModalFooter>
                </Form>
            </Modal>
        </>
    )
}
export default EditMatch;