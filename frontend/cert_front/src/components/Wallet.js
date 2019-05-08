import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {Grid, Typography,Button} from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Fab from '@material-ui/core/Fab';
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import Navbar from './Navbar';
import axios from 'axios';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';

/*const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#757ce8',
      main: '#3f50b5',
      dark: '#002884',
    },
    secondary: {
      light: '#03a9f4',
      main: '#03a9f4',
      dark: '#03a9f4',
    },
  },
});*/



const CustomTableCell = withStyles(theme => ({
	  head: {
		backgroundColor: "#7c7c7c",
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
	
	dialogPdf: {
		height: '90vh'
	}
});

class Wallet extends Component {
  state={
		diplomas: [],
		pdf: null,
		diplomaTitle: '',
		deleteDiploma: null
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
  
  showPdf(key, e) {
		for(let i = 0; i < this.state.diplomas.length; i++) {
			if(this.state.diplomas[i][0] == key) {
				axios.post('http://localhost:8000/api/certificate_file_pdf', {'diploma' : this.state.diplomas[i][1]})
				.then(res => {
					this.setState({ pdf: res.data, diplomaTitle: this.state.diplomas[i][1].badge.name });
				});
				break;
			}
		}
	}

	hidePdf() {
		this.setState({ pdf: null });
	}

	deleteDiploma(key, e) {
		this.setState({ deleteDiploma: key });
	}

	cancelDeleteDiploma() {
		this.setState({ deleteDiploma: null });
	}

	confirmDeleteDiploma() {
		axios.post('http://localhost:8000/api/delete_diploma', {'id' : this.state.deleteDiploma })
		.then(res => {
			let diplomas = this.state.diplomas;
			for(let i = 0; i < diplomas.length; i++) {
				if(diplomas[i][0] == this.state.deleteDiploma) {
					diplomas.splice(i, 1);
					break;
				}
			}
	
			this.setState({ diplomas: diplomas, deleteDiploma: null });
		})
		.catch(e => {
			alert("Une erreur est survenue!")
			this.setState({ deleteDiploma: null });
		});
	}
  
  render(){
	  const { classes } = this.props;
		 return ( 
		  <div className={classes.root}>

			<Dialog open={this.state.pdf !== null} onClose={this.hidePdf.bind(this)} classes={{ paper: classes.dialogPdf }} fullWidth maxWidth="xl">
					<DialogTitle onClose={this.hidePdf.bind(this)}>
						{ this.state.diplomaTitle }
          </DialogTitle>
					<DialogContent>
						<object data={ 'data:application/pdf;base64,' + this.state.pdf } style={{ width: '100%', height: '100%' }}></object>
					</DialogContent>
			</Dialog>

			<Dialog open={this.state.deleteDiploma !== null} onClose={this.cancelDeleteDiploma.bind(this)}>
					<DialogTitle onClose={this.cancelDeleteDiploma.bind(this)}>
						Confirmer la suppresion
          </DialogTitle>
					<DialogContent>
						<DialogContentText>
              Etes-vous sûr de vouloir supprimer ce diplôme ? Cette action n'est pas réversible.
            </DialogContentText>
					</DialogContent>
					<DialogActions>
            <Button onClick={this.cancelDeleteDiploma.bind(this)} color="primary">
              Non
            </Button>
            <Button onClick={this.confirmDeleteDiploma.bind(this)} color="primary">
              Oui
            </Button>
          </DialogActions>
			</Dialog>

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
						<CustomTableCell align="right">Supprimer</CustomTableCell>
					  </TableRow>
					</TableHead>
					<TableBody>
					  {this.state.diplomas.length==0 ? <TableCell colSpan={5} style={{ color: "#7c7c7c", textAlign: 'center'}}> Votre liste de diplômes est vide.</TableCell> : <span></span>}
					  {this.state.diplomas.map(diploma => (
						<TableRow className={classes.row} key={diploma[0]}>
						  <CustomTableCell component="th" scope="row">{diploma[1].badge.name}</CustomTableCell>
						  <CustomTableCell align="right">{diploma[1].badge.issuer.name}</CustomTableCell>
						  <CustomTableCell align="right">{diploma[1].issuedOn.split('-')[0]}</CustomTableCell>
						  <CustomTableCell align="right">
							<Fab color="primary" aria-label="Add" size="small" onClick={this.showPdf.bind(this, diploma[0])}>
								<AddIcon />
							</Fab> 
						  </CustomTableCell>
						  <CustomTableCell align="right">
							<Button color="default" className={classes.button} onClick={this.download.bind(this,diploma[0])}>
								<SaveAltIcon/>
							</Button>
				          </CustomTableCell>
									<CustomTableCell align="right">
							<Button color="default" className={classes.button} onClick={this.deleteDiploma.bind(this,diploma[0])}>
								<DeleteIcon/>
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

