import React, {Component} from 'react';
import {withRouter, NavLink} from 'react-router-dom';

import PropTypes from 'prop-types';
import { withStyles, AppBar, Toolbar, Typography, Button, Menu, MenuItem } from '@material-ui/core';
import Popper from '@material-ui/core/Popper';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import MenuList from '@material-ui/core/MenuList';

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
            <Button component={NavLink} to="/verify" color="inherit" style={{ marginRight: '10px' }}>VERIFIER UN DIPLOME</Button>
            {this.props.connected ? <Button component={NavLink} to="/addDiploma" color="inherit" style={{ marginRight: '10px' }}>AJOUTER UN DIPLOME</Button>
				 : <span></span>}
			{this.props.connected ? <Button component={NavLink} to="/wallet" color="inherit" style={{ marginRight: '10px' }}>MES DIPLOMES</Button>
				 : <span></span>}
            {(!this.props.connected || this.props.connected===false)? <Button  variant="contained" component={NavLink} to="/sign_in">CONNEXION</Button> 
            : <div><Button  variant="contained" aria-owns={anchorEl ? 'simple-menu' : undefined}
              aria-haspopup="true" onClick={this.handleClick}>{sessionStorage.getItem('user_name')}</Button>
              <Popper open={Boolean(anchorEl)} anchorEl={this.anchorEl} transition disablePortal>
                {({ TransitionProps, placement }) => (
                  <Grow {...TransitionProps} id="simple-menu" style={{ transformOrigin: 'center bottom' }}>
                    <Paper>
                      <ClickAwayListener onClickAway={this.handleClose}>
                        <MenuList>
                          <MenuItem component={NavLink} to="/sign_out">Déconnexion</MenuItem>
                        </MenuList>
                      </ClickAwayListener>
                    </Paper>
                  </Grow>
                )}
            </Popper></div>}
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
