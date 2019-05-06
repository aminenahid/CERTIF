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

class SignIn extends Component {
    state={

        username: "",
        password: "",
        redirect :"",
        connected: false

    }
    handleChange = name => event => {
        this.setState({ [name] : event.target.value });
    };
    login = ()=> {
        axios.post('http://localhost:8000/api/login', {'username' :this.state.username,'password':this.state.password})
        .then(res => {
				sessionStorage.setItem('token', res.data.token);
      			this.setState({"connected":true})
      			if ( res.data.is_univ ) {
      				
      				axios({'url':'http://localhost:8000/api/university', 'method':'get', 'headers': {"Authorization" : "token "+sessionStorage.getItem('token')}})
      				.then( res => {
      					sessionStorage.setItem('short_name', res.data.short_name);
      					this.setState({"redirect" :  <Redirect to="/" /> })
      				}).catch(e => {
      					alert("Erreur")
      				})
      			}else {
					//TODO : Connexion d'un étudiant
					sessionStorage.setItem('token', res.data.token);
					this.setState({"connected": true})
					this.setState({"redirect" :  <Redirect to="/" /> })
      				
      			}
        }).catch(e => {
            alert("Erreur, nom de compte ou mdp incorrect")
        })

    }

    redirect = () =>{ 
        this.setState({"redirect" :  <Redirect to="/forgotten" /> })
    }
    
    redirect_signup = () =>{ 
        this.setState({"redirect" :  <Redirect to="/sign_up" /> })
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
                                    <Typography color="primary" variant="h4">Connexion à CERT'<span className="text-bold">IF</span></Typography>
                                </Grid>
                                <Grid item xs={10}>
                                <TextField id="username" type="text" label="Identifiant" className={classes.textField}
                                            value={this.state.username} onChange={this.handleChange('username')}/>
                                </Grid>
                                <Grid item xs={10}>
                                <TextField id="password" type="password" label="Mot de passe" className={classes.textField}
                                            value={this.state.password} onChange={this.handleChange('password')}/>
                                </Grid>
                                <Grid item xs={6}>
                                    <Button color="primary" onClick={this.redirect}>Mot de passe oublié ?</Button>
                                </Grid>
                                <Grid item xs={6}>
                                    <Button variant="contained" color="primary" onClick={this.login}>Connexion</Button>
                                </Grid>
                                <Grid item xs={12}>
                                <Typography color="grey" variant="h6">NOUVEL UTILISATEUR?
                                    <Button onClick={this.redirect_signup}>Inscris-toi</Button></Typography>
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

SignIn.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SignIn)
