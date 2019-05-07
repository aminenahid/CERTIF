import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {Grid, Typography, Paper,Button, TextField} from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Fab from '@material-ui/core/Fab';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import AddIcon from '@material-ui/icons/Add';
import Navbar from './Navbar'
import axios from 'axios'



	
const CustomTableCell = withStyles(theme => ({
	  head: {
		backgroundColor: theme.palette.common.black,
		color: theme.palette.common.white,
		fontSize: 18,
	  },
	  body: {
		fontSize: 14,
	  },
	}))(TableCell);

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
  
  row: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.background.default,
    },
  },
});

class Wallet extends Component {
  state={
    diplomas: []
  } 
  
  download(key, e) {
	let date = new Date();
	let filename = "diploma"+date.getFullYear()+"_"+(date.getMonth()+1)+"_"+(date.getDay()+1)+".json";
    let contentType = "application/json;charset=utf-8;";
    let diploma_to_download ;
	for (let i=0; i<this.state.diplomas.length ; i++){
		if(this.state.diplomas[i][0]==key){
			console.log( this.state.diplomas[i][1]);
			diploma_to_download =  this.state.diplomas[i][1];
			break
		}
	}
	var a = document.createElement('a');
    a.download = filename;
    a.href = 'data:' + contentType + ',' + encodeURIComponent(JSON.stringify(diploma_to_download));
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
  
  componentWillMount() {
	  axios({'url':'http://localhost:8000/api/wallet', 'method':'get', 'headers': {"Authorization" : "token "+sessionStorage.getItem('token')}})
      				.then( res => {
						console.log(res.data);
      					this.setState( { "diplomas":res.data.diplomas } )
				}).catch(e => {
      					alert("Une erreur est survenue!")
				})
  }
  
  

	
  
  render(){
	  const { classes } = this.props;
		 return ( 
		  <div className={classes.root}>
			<Navbar connected={sessionStorage.getItem('token')!==null} />
			  <Grid container justify="center" >
				<Grid item xs={10}>
				  <br/>
				  <Typography variant="h3" className={classes.h3} color="primary">MES DIPLOMES</Typography>
				  <br/>
				</Grid>
				<Grid item xs={10} >
				  <Table className={classes.table}>
					<TableHead>
					  <TableRow>
						<CustomTableCell>Nom</CustomTableCell>
						<CustomTableCell align="right">Ecole / Université</CustomTableCell>
						<CustomTableCell align="right">Année</CustomTableCell>
						<CustomTableCell align="right">Visualiser</CustomTableCell>
						<CustomTableCell align="right">Télécharger</CustomTableCell>
					  </TableRow>
					</TableHead>
					<TableBody>
					  {this.state.diplomas.map(diploma => (
						<TableRow className={classes.row} key={diploma[0]}>
						  <CustomTableCell component="th" scope="row">{diploma[1].badge.name}</CustomTableCell>
						  <CustomTableCell align="right">{diploma[1].badge.issuer.name}</CustomTableCell>
						  <CustomTableCell align="right">{diploma[1].issuedOn.split('-')[0]}</CustomTableCell>
						  <CustomTableCell align="right">
							<Fab color="primary" aria-label="Add" size="small">
								<AddIcon />
							</Fab> 
						 </CustomTableCell>
						 <CustomTableCell align="right">
						 <Button variant="contained" color="default" className={classes.button} onClick={this.download.bind(this,diploma[0])}>
							<CloudUploadIcon className={classes.rightIcon} />
						 </Button>
				         </CustomTableCell>
						</TableRow>
					  ))}
					</TableBody>
				  </Table>
				</Grid>

				<Grid item xs={9}>
				 
				</Grid>
			  </Grid>
			</div>
		   )
	  }
}

Wallet.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Wallet);

