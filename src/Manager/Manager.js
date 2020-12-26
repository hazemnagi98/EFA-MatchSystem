import React, { useContext, useState } from 'react'
import { Link, Redirect } from 'react-router-dom'
import { Row, Col, Container, Button, ListGroup, ListGroupItem, ListGroupItemHeading } from 'reactstrap';
import { AuthContext } from '../Auth/Auth';
import CreateMatch from './Match/CreateMatch/CreateMatch';
import AddStadium from './Match/AddStadium/AddStadium';
const Manager = () => {
    const { currentUser } = useContext(AuthContext);
    const [createMatchModal, setCreateMatchModal] = useState(false);

    const toggleCreateMatch = () => setCreateMatchModal(!createMatchModal);

    const [addStadiumModal, setAddStadiumModal] = useState(false);

    const toggleAddStadium = () => setAddStadiumModal(!addStadiumModal);



    if (currentUser !== null) {
        if (currentUser.claims.role !== 'manager')
            return (
                <Redirect to='/' />
            )
    }
    else
        return (
            <Redirect to='/' />)



    return (
        <Container className='p-4'>
            <Row>
                <Col>
                    <ListGroup className='text-center'>
                        <ListGroupItem>
                            <Button onClick={toggleCreateMatch}>Create Match</Button>
                            <CreateMatch
                                modal={createMatchModal}
                                toggle={toggleCreateMatch}
                            />
                        </ListGroupItem>
                        <ListGroupItem>
                            <Button onClick={toggleAddStadium}>Add Stadium</Button>
                            <AddStadium
                                modal={addStadiumModal}
                                toggle={toggleAddStadium}
                            />
                        </ListGroupItem>
                        <ListGroupItem>
                            <ListGroupItemHeading><Link to='/manager/matches'>View All Matches</Link></ListGroupItemHeading>
                        </ListGroupItem>
                    </ListGroup>
                </Col>
            </Row>
        </Container>
    )
}

export default Manager;