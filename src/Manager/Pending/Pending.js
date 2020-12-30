import React from 'react';
import { Jumbotron } from 'reactstrap';
const Pending = () => {
    return (
        <Jumbotron style={{ marginTop: '10%' }}>
            <h5 className="display-4">Hey there, your account is still pending from by your admin, please contact them for account activation!</h5>
        </Jumbotron>
    );
};

export default Pending;