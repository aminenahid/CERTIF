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
    status:"noFile",
    pdf:null
  } 
  fileHandler = (uploadedFile)=>{
    let diploma = null;
    try{
		uploadedFile = decodeURIComponent(escape(uploadedFile));
		diploma=JSON.parse(uploadedFile);
	}
	catch(error){
		alert("Votre fichier n'est pas valide.");
		return
	}
    this.setState({'file':uploadedFile});
    axios.post('http://localhost:8000/api/certificate_file_pdf', {'diploma' : diploma})
    .then(res => {
      this.setState({'pdf':res.data, status:'validFile'});
    }).catch(e => {
      this.setState({'status':'noFile', 'file':null});
      alert("Votre fichier n'est pas valide.");
    })
  }
  verifyFile = () => {
    axios.post('http://localhost:8000/api/verify_certificate', {'diploma' : JSON.parse(this.state.file)})
    .then(res => {
        let response = res.data;
        if(response.is_valid===true){
          this.setState({"status":"Ok"});
        }else{
          this.setState({"status":"notOk"});
        }     
    }).catch(e => {
        this.setState({status:"notOk"})
    })


  }
  
  render(){

  const { classes } = this.props;
  let dropzone;
  if(!this.state.pdf){
    dropzone=<Dropzone action={this.fileHandler} />
  } else {
    dropzone=<object data={ 'data:application/pdf;base64,' + this.state.pdf } style={{width:'100%', height:'400px'}}></object>
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
              <Button variant="contained" color="primary" disabled={this.state.status==="noFile"} onClick={()=>{this.setState({'file':null,'status':'noFile',pdf:null})}}>Changer diplome</Button>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={2}>
          <Grid container spacing={8} justify="center">
            <Grid item>
              <Pastille status={this.state.status} />
            </Grid>
            <Grid item><Button variant="contained" onClick={this.verifyFile} color="primary" disabled={(this.state.status==="Ok"||this.state.status==="notOk"||this.state.status==="noFile")}>Verifier</Button></Grid>
            
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
