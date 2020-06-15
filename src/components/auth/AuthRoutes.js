import { Route, Redirect } from 'react-router-dom';
import React from 'react';
import { useStateValue } from '../../sessions/store';


function AuthRoutes({ component: Component, authFirebase, ...rest }) {
    const [{ auth }, dispatch] = useStateValue();
    return (
        <Route
            {...rest}
            render={(props) => (auth === true || authFirebase !== null)
                ?
                <Component {...props} {...rest}></Component>
                :
                <Redirect to='/auth/signin'></Redirect>
            }
        >

        </Route>
    )
}

export default AuthRoutes;