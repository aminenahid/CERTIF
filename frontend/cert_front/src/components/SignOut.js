import React, {Component} from 'react';
import Navbar from './Navbar'
import  { Redirect } from 'react-router-dom'

class SignOut extends Component {
    render(){
        sessionStorage.clear()
        return (
            
            <div className="signOutComponent">
                <Navbar connected={false} />
                <Redirect to="/" />            
            </div>            
        )
    }
}

export default SignOut