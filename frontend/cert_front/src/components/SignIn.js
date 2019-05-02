import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {Grid, TextField, Typography, Paper, Button} from '@material-ui/core';

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
        password: ""
    }
    handleChange = name => event => {
        this.setState({ [name] : event.target.value });
    };

    render(){
        const {classes} = this.props;
        return (
            <div className="signInComponent">
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
                                    <Button color="primary">Mot de passe oublié ?</Button>
                                </Grid>
                                <Grid item xs={6}>
                                    <Button variant="contained" color="primary">Connexion</Button>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                </Grid>
            </div>            
        )
    }
}

SignIn.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SignIn)