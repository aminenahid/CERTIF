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
        width: 600,
        marginTop: theme.spacing.unit * 20
    },
    paperFooter:{
        textAlign: 'center'
    },
    textField: {
        width: 200,
    },

  });

class SignUp extends Component {
    state={

        username: "",
        password: "",
        confirm_password: "",
        email: "",
        last_name : "",
        given_names : "",
        redirect :"",
        message :"",
        connected: false

    }
    handleChange = name => event => {
        this.setState({ [name] : event.target.value });
    };
    signup = ()=> {
		if(this.state.password == this.state.confirm_password) {
			axios.post('http://localhost:8000/api/signup', {'username' :this.state.username,'password':this.state.password,'email' :this.state.email, 'last_name' :this.state.last_name, 'given_names':this.state.given_names })
			.then(res => {
					if ( res.data.action ) {
						this.setState({"message" : "Votre compte a été créé avec succès." })
					}else {
						this.setState({"message" : res.data.erreur })
					}
			}).catch(e => {
				alert("Erreur")
			})
		}else{
			this.setState({"message" : "Les mots de passe ne sont pas identiques." })
		}

    }

    redirect = () =>{ 
        this.setState({"redirect" :  <Redirect to="/sign_in" /> })
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
                                    <Typography color="primary" variant="h4">Inscription à CERT'<span className="text-bold">IF</span></Typography>
                                </Grid>
                                <Grid item xs={6}>
                                <TextField required id="last_name" type="text" label="Nom" className={classes.textField}
                                            value={this.state.last_name} onChange={this.handleChange('last_name')}/>
                                </Grid>
                                <Grid item xs={6}>
                                <TextField required id="given_names" type="text" label="Prénoms" className={classes.textField}
                                            value={this.state.given_names} onChange={this.handleChange('given_names')}/>
                                </Grid>
                                <Grid item xs={6}>                       
                                <TextField required id="username" type="text" label="Nom d'utilisateur" className={classes.textField}
                                            value={this.state.username} onChange={this.handleChange('username')}/>
                                </Grid>
                                <Grid item xs={6}>
                                <TextField required id="email" type="text" label="Adresse mail" className={classes.textField}
                                            value={this.state.email} onChange={this.handleChange('email')}/>
                                </Grid>
                                <Grid item xs={6}>
                                <TextField required id="password" type="password" label="Mot de passe" className={classes.textField}
                                            value={this.state.password} onChange={this.handleChange('password')}/>
                                </Grid>
                                <Grid item xs={6}>
                                <TextField required id="confirm_password" type="password" label="Confirmer mot de passe" className={classes.textField}
                                            value={this.state.confirm_password} onChange={this.handleChange('confirm_password')}/>
                                </Grid>
                                <Grid item xs={10}>
                                <Typography id = "message" color="primary" variant="h6">{this.state.message}</Typography>
                                </Grid>
                                <Grid item xs={10}>
                                    <Button variant="contained" color="primary" onClick={this.signup}>Inscription</Button>
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

SignUp.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SignUp)
