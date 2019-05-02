import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {Grid, Typography, Paper,Button} from '@material-ui/core';
import axios from 'axios'
import Dropzone from './Dropzone'
import Pastille from './Pastille'
import Navbar from './Navbar'

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  h3: {
    textAlign: 'center',
    marginTop: 24
  }

});

class Verify extends Component {
  state={
    file:null,
    status:"noFile"
  } 
  fileHandler = (uploadedFile)=>{
    this.setState({'file':uploadedFile,status:'fileNotVerif'})
  }
  verify= () => {
    axios.post('http://localhost:8000/api/verify_certificate', this.state.file)
    .then(res => {
        let response = res.data;
        if(response.is_valid==true){
          this.setState({"status":"Ok"});
        }else{
          this.setState({"status":"notOk"});
        }
       
    }).catch(e => {
        alert("erreur, serveur injoignable ou fichier incorrect")
        this.setState({"file":null,status:"noFile"})
    })


  }
  
  render(){

  const { classes } = this.props;
  let dropzone;
  if(!this.state.file){
    dropzone=<Dropzone action={this.fileHandler} />
  } else {
    let theFile=JSON.parse(this.state.file);
    theFile.image=null;
    theFile.badge.image=null
    theFile.badge.issuer.image=null
    theFile.badge.signatureLines[0].image=null
    console.log(theFile)
    dropzone=<Paper className={classes.paper}><Typography variant="body1">{JSON.stringify(theFile)}</Typography></Paper>
  }
  return (
    <div className={classes.root}>
    <Navbar connected={sessionStorage.getItem('token')!==null} />
      <Grid container direction="row" justify="center" alignItems ="center">
        <Grid item xs={12}>
          <br/>
            <Typography variant="h3" color="primary" className={classes.h3}>CONSULTER ET AUTHENTIFIER UN DIPLOME</Typography>
          <br/>
        </Grid>
        <Grid item xs={11} md={9} >
          {dropzone}
          <br/>
          <Grid container justify="flex-end">
            <Grid item>
              <Button variant="contained" color="primary" disabled={this.state.status==="noFile"} onClick={()=>{this.setState({'file':null,'status':'noFile'})}}>Changer diplome</Button>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={2}>
          <Grid container spacing={8} justify="center">
            <Grid item>
              <Pastille status={this.state.status} />
            </Grid>
            <Grid item><Button variant="contained" onClick={this.verify} color="primary" disabled={(this.state.status==="Ok"||this.state.status==="notOk"||this.state.status==="noFile")}>Verifier</Button></Grid>
            
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
  }
}

Verify.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Verify);
