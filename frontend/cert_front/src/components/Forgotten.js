import React, {Component} from 'react'
import  { Redirect } from 'react-router-dom'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {Grid, TextField, Typography, Paper, Button} from '@material-ui/core';
import axios from 'axios'
import Navbar from './Navbar'

const styles = theme => ({
    root: {
        flexGrow: 1,
      },
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    mainPaper:{
        margin: theme.spacing.unit * 4,
        padding: theme.spacing.unit *2,
        textAlign: 'center',
        width: 400,
        marginTop: theme.spacing.unit * 20
    },
    paperFooter:{
        textAlign: 'center'
    },
    textField: {
        width: 200,
    },

  });

class Forgotten extends Component {
    state={

        email: "",
        redirect :"",
        connected: false

    }
    handleChange = name => event => {
        this.setState({ [name] : event.target.value });
    };
    askEmail = ()=> {
        console.log(this.state.email)
    }

    render(){
        const {classes} = this.props;
        return (

            <div className="signInComponent">
            <Navbar connected={this.state.connected} />
                <Grid container className="classes.root" justify="center">
                    <Grid item>
                        <Paper className={ classes.mainPaper }>
                            <Grid container direction= "row" justify="center" spacing={24}>
                                <Grid item xs={12}>
                                    <Typography color="primary" variant="h4">MOT DE PASSE OUBLIÉ ?</Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="body2">
                                        Entrez l'adresse e-mail associée au compte pour recevoir un mail de réinitialisation.
                                    </Typography>
                                </Grid>
                                <Grid item xs={10}>
                                <TextField fullWidth margin="normal" id="email" type="text" label="email" className={classes.textField}
                                            value={this.state.email} onChange={this.handleChange('email')}/>
                                </Grid>
                                <Grid item xs={6}>
                                    <Button variant="contained" color="primary" onClick={this.askEmail}>Envoyer</Button>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                </Grid>
                {this.state.redirect}
            </div>
        )
    }
}

Forgotten.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Forgotten)
