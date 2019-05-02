import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {Grid, Typography, Paper,Button} from '@material-ui/core';
import Dropzone from './Dropzone'
import Pastille from './Pastille'

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

  render(){
  const { classes } = this.props;
  let dropzone;
  if(!this.state.file){
    dropzone=<Dropzone action={this.fileHandler} />
  } else {
    dropzone=<Paper className={classes.paper}><Typography variant="body1">{this.state.file}</Typography></Paper>
  }
  return (
    <div className={classes.root}>
      <Grid container direction="row" justify="center" alignItem="center" spacing={24}>
        <Grid item xs={12}>
          <br/>
            <Typography variant="h3" color="primary" className={classes.h3}>CONSULTER ET AUTHENTIFIER UN DIPLOME</Typography>
          <br/>
        </Grid>
        <Grid item xs={9} >
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
            <Grid item><Button variant="contained" color="primary" disabled={(this.state.status==="Ok"||this.state.status==="notOk"||this.state.status==="noFile")}>Verifier</Button></Grid>
            
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
