import React, {Component} from 'react';
import Navbar from './Navbar'
import {Grid, Typography } from '@material-ui/core';

class Home extends Component {
    render(){

        return (
            <div className="homeComponent">
                <Navbar connected={sessionStorage.getItem('token')!==null} />           

                <Grid container justify="center">
                    <Grid item>
                        <br/>
                        <Typography variant="h3" color="primary">BIENVENUE</Typography>
                    </Grid>
                </Grid>
            </div>            
        )
    }
}

export default Home