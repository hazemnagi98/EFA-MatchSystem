import React from 'react';
import firebase from '../.././../firebase';

import { Modal, ModalBody, ModalHeader, ModalFooter, Button, Form, FormGroup, Input, Label } from 'reactstrap';

const AddStadium = props => {
    const handleAddStadium = async (e) => {
        e.preventDefault();
        const form = e.target;
        const stadiumName = form['name'].value;
        const numberOfRows = parseInt(form['rows'].value);
        const numberOfSeats = parseInt(form['seats'].value);
        if (typeof numberOfRows === 'number' && typeof numberOfSeats === 'number') {
            if (numberOfSeats > 0 && numberOfRows > 0) {
                await firebase.firestore().collection('stadiums').doc().set({
                    name: stadiumName,
                    numberOfRows: numberOfRows,
                    numberOfSeats: numberOfSeats
                })
                form.reset();
                props.toggle();
            }
            else {
                alert('Please enter valid numbers');
            }
        }
        else
            alert('Only numbers are acceptable');
    }
    return (
        <Modal isOpen={props.modal} toggle={props.toggle} >
            <ModalHeader toggle={props.toggle}>Modal title</ModalHeader>
            <Form onSubmit={handleAddStadium}>
                <ModalBody>
                    <FormGroup>
                        <Label>
                            Stadium Name
                </Label>
                        <Input type='text' name='name' required placeholder="Enter Stadium Name" />
                    </FormGroup>

                    <FormGroup>
                        <Label>
                            Number of Rows
                </Label>
                        <Input type='number' name='rows' required placeholder="Enter Number of Rows" />
                    </FormGroup>

                    <FormGroup>
                        <Label>
                            Number of Seats Per Row
                </Label>
                        <Input type='number' name='seats' required placeholder="Enter Number of Seats" />
                    </FormGroup>

                </ModalBody>
                <ModalFooter>
                    <Button color="success" type='submit'>Add Stadium</Button>{' '}
                    <Button color="warning" onClick={props.toggle}>Cancel</Button>
                </ModalFooter>
            </Form>
        </Modal>)
}

export default AddStadium;