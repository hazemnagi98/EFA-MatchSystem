import React from 'react';
import { Spinner } from 'reactstrap'
import classes from './Loading.module.css'

/**
 * @component Loading
 * @returns Shared component for loading to be used by any component that requires to show a loading action such as waiting for a Firestore read or loading a new code-split chunk
 */
const Loading = () => {
    return (
        <>
            <Spinner className={classes.Spinner} animation="border" color="primary" />
        </>
    )
}

export default Loading;
