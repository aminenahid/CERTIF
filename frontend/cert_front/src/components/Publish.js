import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {Grid, Typography, Paper,Button, TextField} from '@material-ui/core';
import Dropzone from './Dropzone'
import Pastille from './Pastille'

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
  }

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
    console.log(this.state.privateKey)
  };

  render(){
  const { classes } = this.props;
  let dropzone;
  let keyzone;
  if(!this.state.file){
    dropzone=<Dropzone action={this.fileHandler} />
  } else {
    dropzone=<Paper className={classes.paper}><Typography variant="body1">{this.state.file}</Typography></Paper>
  }
  return (
    <div className={classes.root}>
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
              <Button variant="contained" color="primary" disabled={this.state.status==="noFile" || this.state.privateKey===""} onClick={()=>{this.setState({'file':null,'status':'noFile'})}}>Enregistrer</Button>
            </Grid>
            <Grid item>
              <Button variant="contained" color="primary" disabled={this.state.status==="noFile"} onClick={()=>{this.setState({'file':null,'status':'noFile'})}}>Changer fichier</Button>
            </Grid>

          </Grid>
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
