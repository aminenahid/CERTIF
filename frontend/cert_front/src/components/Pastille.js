import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import {Typography, Avatar, Grid} from '@material-ui/core';


const styles = theme => ({
    root: {
      flexGrow: 1,
    },
    orangeAvatar: {
      margin: 10,
      color: '#ffffff',
      backgroundColor: '#ff6d00',
      width: '160px',
      height: '160px'
    },
    greenAvatar: {
        margin: 10,
        color: '#ffffff',
        backgroundColor: '#64dd17',
        width: '160px',
        height: '160px'
    },
    redAvatar: {
    margin: 10,
    color: '#ffffff',
    backgroundColor: '#d50000',
    width: '160px',
    height: '160px'
    },
    greyAvatar: {
        margin: 10,
        color: '#ffffff',
        backgroundColor: '#9e9e9e',
        width: '160px',
        height: '160px'
        },
    avatarText: {
      fontColor: '#ffffff' 
    },
    body2:{
        textAlign: 'center',
        padding : 8
    }
  
  });

function Pastille(props){

    const{classes}= props
    console.log(props)
    if(props.status === 'fileNotVerif'){
        return (
            <div>
            <Grid container direction="column" alignItems="center" spacing={8} justify="center">
                    <Grid item>
                        <Avatar className={classes.orangeAvatar}>
                            <Typography variant="h1" color="secondary" className="avatarText">?</Typography>
                        </Avatar>
                    </Grid>
                    <Grid item>
                        <Typography variant="body2" className={classes.body2}>Ce diplome n'a pas encore été vérifié, cliquez sur le bouton pour vérifier</Typography>
                    </Grid>
                </Grid>
            </div>
        )
    } else if (props.status === "Ok"){
        return (
            <div>
            <Grid container direction="column" alignItems="center" spacing={8} justify="center">
                    <Grid item>
                        <Avatar className={classes.greenAvatar}>
                            <Typography variant="h1" className="avatarText">V</Typography>
                        </Avatar>
                    </Grid>
                    <Grid item>
                        <Typography variant="body2" className={classes.body2}>Ce diplome est bien enregistré dans la blockchain par une école certifiée</Typography>
                    </Grid>
                </Grid>
            </div>
        )
    } else if (props.status==='notOk'){
        return (
            <div>
                <Grid container direction="column" alignItems="center" spacing={8} justify="center">
                    <Grid item>
                        <Avatar className={classes.redAvatar}>
                            <Typography variant="h1" className="avatarText">X</Typography>
                        </Avatar>
                    </Grid>
                    <Grid item>
                        <Typography variant="body2" className={classes.body2}>Ce diplome est faux ou non enregistré dans la bockchain par une école certifiée</Typography>
                    </Grid>
                </Grid>

            </div>
        )
    } else {
        return (
            <div>
            <Grid container direction="column" alignItems="center" spacing={8} justify="center">
                    <Grid item>
                        <Avatar className={classes.greyAvatar}>
                            <Typography variant="h1" color="secondary" light className="avatarText">?</Typography>
                        </Avatar>
                        </Grid>
                    <Grid item>
                        <Typography variant="body2" className={classes.body2}>Chargez un fichier pour commencer</Typography>
                    </Grid>
                </Grid>
            </div>
        )
    }



}

export default withStyles(styles)(Pastille)
