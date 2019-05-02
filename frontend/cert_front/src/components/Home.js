import React, {Component} from 'react';
import Navbar from './Navbar'


class Home extends Component {
    render(){

        return (
            <div className="homeComponent">
                <Navbar connected={sessionStorage.getItem('token')!==null} />            
            </div>            
        )
    }
}

export default Home