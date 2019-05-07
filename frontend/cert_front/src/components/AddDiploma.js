import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {Grid, Typography,Button } from '@material-ui/core';
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

class AddDiploma extends Component {
  state={
    file:null,
    status:"noFile",
    pdf:null
  } 
  fileHandler = (uploadedFile)=>{
    uploadedFile = decodeURIComponent(escape(uploadedFile));
    this.setState({'file':uploadedFile,status:'fileNotVerif'});
    axios.post('http://localhost:8000/api/certificate_file_pdf', {'diploma' : JSON.parse(this.state.file)})
    .then(res => {
      this.setState({'pdf':res.data});
    });
  }
  
  add= () => {
    axios({
      'url':'http://localhost:8000/api/add', 
      'data':{'diploma' : JSON.parse(this.state.file)},
      'method':'post',
      'headers': {"Authorization" : "token "+sessionStorage.getItem('token')}
    }).then(res => {
      let response = res.data;
      if(response.upload_status == "ok"){
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
	  if(!this.state.pdf){
		dropzone=<Dropzone action={this.fileHandler} />
	  } else {
		dropzone=<object data={ 'data:application/pdf;base64,' + this.state.pdf } style={{width:'100%', height:'400px'}}></object>
	  }
	  let confirmZone;
	  if(this.state.status==="Ok"){
		confirmZone=<Typography variant="body1"  style={{ color: "#086d08"}}><b>Votre diplome a bien été enregistré</b></Typography>
	  }else if(this.state.status==="notOk"){
		confirmZone=<Typography variant="body1" color="primary"><b>Erreur. Votre diplome n'a pas été enregistré.</b></Typography>
	  }else{
		confirmZone=<p></p>
	  }
	  return (
		<div className={classes.root}>
		<Navbar connected={sessionStorage.getItem('token')!==null} />
		  <Grid container justify="center" spacing={24}>
			<Grid item>
			  <br/>
			  <Typography variant="h3" className={classes.h3} color="primary">AJOUTER UN DIPLOME</Typography>
			  <br/>
			</Grid>
			<Grid item xs={9} >
			  {dropzone}
			  <br/>
			</Grid>
			<Grid item xs={9}>
			  <Grid container direction="row" justify="flex-end" spacing={24}>
				<Grid item>
				  <Button variant="contained" color="primary" disabled={this.state.status==="noFile"} onClick={this.add}>Enregistrer</Button>
				</Grid>
				<Grid item>
				  <Button variant="contained" color="primary" disabled={this.state.status==="noFile"} onClick={()=>{this.setState({'file':null,'status':'noFile',pdf:null})}}>Changer fichier</Button>
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

AddDiploma.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AddDiploma);

