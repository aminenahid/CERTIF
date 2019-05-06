import React, {Component} from 'react';
import {withRouter, NavLink} from 'react-router-dom';

import PropTypes from 'prop-types';
import { withStyles, AppBar, Toolbar, Typography, Button, Menu, MenuItem } from '@material-ui/core';



const styles = {
  root: {
    flexGrow: 1,
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
};

class ButtonAppBar extends Component {
  state= {
    anchorEl: null
  };
  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };
  render(){ 

    const{classes}=this.props;
    const anchorEl=this.state.anchorEl;

    return (
      
      <div className={classes.root}>
        <AppBar position="static" color="primary">
          <Toolbar>
            <Typography variant="h6" color="inherit" className={classes.grow}>
              CERT'<span className="text-bold">IF</span>
            </Typography>
            <Button component={NavLink} to="/verify" color="inherit">VERIFIER UN DIPLOME</Button>
            {this.props.connected ? <Button component={NavLink} to="/publish" color="inherit">PUBLIER</Button> : <span></span>}
            {(!this.props.connected || this.props.connected===false)? <Button  variant="contained" component={NavLink} to="/sign_in">CONNEXION</Button> 
            : <Button  variant="contained" aria-owns={anchorEl ? 'simple-menu' : undefined}
              aria-haspopup="true" onClick={this.handleClick}>{sessionStorage.getItem('short_name')}</Button>}
            <Menu id="simple-menu" anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={this.handleClose}>
              <MenuItem component={NavLink} to="/sign_out" >Déconnexion</MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>
      </div>
      );
    }
  
}

ButtonAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styles)(ButtonAppBar));