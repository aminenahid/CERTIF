import React from 'react';
import {withRouter, NavLink} from 'react-router-dom';

import PropTypes from 'prop-types';
import { withStyles, AppBar, Toolbar, Typography, Button } from '@material-ui/core';



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

function ButtonAppBar(props) {
  const { classes } = props;
  return (
    <div className={classes.root}>
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" color="inherit" className={classes.grow}>
            CERT'<span className="text-bold">IF</span>
          </Typography>
          <Button component={NavLink} to="/verify" color="inherit">VERIFIER</Button>
          {/*} <Button component={NavLink} to="/about" color="inherit">A PROPOS</Button>
          <Button component={NavLink} to="/contact" color="inherit">CONTACT</Button> */}
          <Button component={NavLink} to="/publish" color="inherit">PUBLIER</Button>
          <Button  variant="contained" component={NavLink} to="/sign_in">CONNEXION</Button>
        </Toolbar>
      </AppBar>
    </div>
  );
}

ButtonAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styles)(ButtonAppBar));