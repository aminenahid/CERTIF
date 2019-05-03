import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {Grid, Typography, Paper,Button, TextField} from '@material-ui/core';
import Dropzone from './Dropzone'
import Navbar from './Navbar'
import axios from 'axios'

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  h3: {
    textAlign: 'center',
    marginTop: 24
  },
  keyField: {
    margin : 8
  },

});

class Publish extends Component {
  state={
    file:null,
    status:"noFile",
    privateKey:""
  } 
  fileHandler = (uploadedFile)=>{
    this.setState({'file':uploadedFile,status:'fileNotVerif'})
  }
  handleChange = name => event => {
    this.setState({ [name] : event.target.value });
  };
  publish= () => {
    axios({
      'url':'http://localhost:8000/api/issue', 
      'data':{'diploma' : JSON.parse(this.state.file), 'private_key': this.state.privateKey},
      'method':'post',
      'headers': {"Authorization" : "token "+sessionStorage.getItem('token')}
    }).then(res => {
      let response = res.data;
      if(response.action){
        this.setState({"status":"Ok"});
      }else{
        this.setState({"status":"notOk"});
      }
      
    }).catch(e => {
      this.setState({"status":"notOk"});
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
  let confirmZone;
  if(this.state.status==="Ok"){
    confirmZone=<Typography variant="body1">Votre diplome a bien été enregistré</Typography>
  }else if(this.state.status==="notOk"){
    confirmZone=<Typography variant="body1">Votre diplome n'a pas été enregistré (clef privée incorrecte)</Typography>
  }else{
    confirmZone=<p></p>
  }
  return (
    <div className={classes.root}>
    <Navbar connected={sessionStorage.getItem('token')!==null} />
      <Grid container justify="center" spacing={24}>
        <Grid item>
          <br/>
          <Typography variant="h3" className={classes.h3} color="primary">PUBLIER UN DIPLOME</Typography>
          <br/>
        </Grid>
        <Grid item xs={9} >
          {dropzone}
          <br/>
        </Grid>
        <Grid item xs={9}>
          <Paper>
            <Grid container>
              <Grid item xs={11}>
                <TextField fullWidth margin="normal" label="Clef privée" className={classes.keyField}  value={this.state.privateKey} onChange={this.handleChange('privateKey')}></TextField>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        <Grid item xs={9}>
          <Grid container direction="row" justify="flex-end" spacing={24}>
            <Grid item>
              <Button variant="contained" color="primary" disabled={this.state.status==="noFile" || this.state.privateKey===""} onClick={this.publish}>Enregistrer</Button>
            </Grid>
            <Grid item>
              <Button variant="contained" color="primary" disabled={this.state.status==="noFile"} onClick={()=>{this.setState({'file':null,'status':'noFile'})}}>Changer fichier</Button>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={9}>
          {confirmZone}
        </Grid>
      </Grid>
    </div>
  );
  }
}

Publish.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Publish);

