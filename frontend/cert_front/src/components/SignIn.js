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
        message : " ",
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
      			axios({'url':'http://localhost:8000/api/user', 'method':'get', 'headers': {"Authorization" : "token "+sessionStorage.getItem('token')}})
      				.then( res => {
      					sessionStorage.setItem('user_name', res.data.last_name+' '+res.data.given_names);
      					this.setState({"redirect" :  <Redirect to="/" /> })
				}).catch(e => {
      					alert("Une erreur est survenue!")
				})
        }).catch(e => {
			this.setState({"message" : "Identifiant ou mot de passe incorrect." })
            
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
                                <Grid item xs={12}>
                                    <Typography id = "message" color="primary" variant="h6">{this.state.message}</Typography>
                                </Grid>
                                <Grid item xs={10}>
                                <TextField id="username" type="text" label="Identifiant" className={classes.textField}
                                            value={this.state.username} onChange={this.handleChange('username')}/>
                                </Grid>
                                <Grid item xs={10}>
                                <TextField id="password" type="password" label="Mot de passe" className={classes.textField}
                                            value={this.state.password} onChange={this.handleChange('password')}/>
                                <br/>
                                </Grid>
                                <Grid item xs={6}>
                                    <Button color="primary" onClick={this.redirect}>Mot de passe oublié ?</Button>
                                </Grid>
                                <Grid item xs={6}>
                                    <Button variant="contained" color="primary" onClick={this.login}>Connexion</Button>
                                    <br/><br/>
                                </Grid>
                                <Grid item xs={12} style={{ backgroundColor:"#e5e5e5"}}>
                                <Typography variant="h6" style={{ color:"#000000"}}>Nouvel utilisateur?
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
