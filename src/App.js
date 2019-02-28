import React from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import CssBaseline from '@material-ui/core/CssBaseline';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';

function getModalStyle() {
	const top = 50;
	const left = 50;
  
	return {
	  top: `${top}%`,
	  left: `${left}%`,
	  transform: `translate(-${top}%, -${left}%)`,
	};
  }

const styles = theme => ({
	Button: {
		marginBottom: '7px',
		marginLeft: '5px',
		verticalAlign: 'bottom'

	},
	SavedCities:{
		float:'left',
		width:'20%'
	},
	SearchForm:{
		float:'left',
		width:'80%'
	},
	Container:{
		display: 'flex',
		width: '60%',
		verticalAlign: 'center',
		margin: '0 auto'
	},

	Icon: {
		float: 'right'
	},
	Modal: {
		position: 'absolute',
		width: '350px',
		height: '150px',
		background: '#e0e0e0',
		boxShadow: theme.shadows[5],
		textAlign: 'center',
		
		
		outline: 'none',
		borderStyle: 'solid',
		  borderColor: 'red',
		
	  },
	  Warning: {
		padding: '30px'
	  },
	  Error:{
		  color: 'red'
	  }


});

function SaveButton(props) {
	return (
	  <Button variant="contained" color="primary" onClick={props.onClick}>
		Save city
	  </Button>
	);
  }
 
function ListSavedCities(props) {
	return(
		<div>
		<h3>Saved cities:</h3>
		<List>
		{props.map(props =>
		 <ListItem key={props} >{props}</ListItem>
		 )}
		</List>
		</div>
	);
	
  }

  

class App extends React.Component {
    constructor(props) {
      super(props);
      this.state={
        value:'',
        open:false,
		cityweather: '',
		savedCities: [],
		searchError: 0
      }
  
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
	}
	
	componentDidMount() {
		
		this.setState({savedCities: JSON.parse(localStorage.getItem('cities'))});
	}
  
    handleChange(event) {
      this.setState({value: event.target.value});
    }
    handleClose = () => {
	  this.setState({ open: false });
	  this.setState({ searchError: 0 });
    };
  
    handleSubmit(event) {
        var self = this;
        
        if(self.state.value === ''){
          this.setState({ open: true });
            event.preventDefault();
        }
        else{
            event.preventDefault();
            fetch('http://api.openweathermap.org/data/2.5/weather?q='+self.state.value+'&units=metric&appid=4fddf5a9dd1f08a863d525af340bd510')
		.then((response) => {
			if(!response.ok) throw new Error(response.status);
			else return response.json();
		}).then((data) => {
			this.setState({ cityweather: data });
			this.setState({ searchError: 0 });
		}).catch((error) => {
			console.log('error: ' + error);
			this.setState({ searchError: 1 });
		});
        }
	}
	
	handleSaveClick() {
		let cities = [];
		let city = this.state.cityweather.name;
		if(this.state.savedCities !== undefined){
			cities = this.state.savedCities;
		}
		cities.push(city);
		this.setState({
			savedCities: cities
		  });
		  
		  localStorage.setItem('cities', JSON.stringify(cities));
		  
	  }
  
    render() {
		const { classes } = this.props;
		let weather;
		let button;
		let savedList;
		let error;
		if(typeof this.state.cityweather === 'object' && this.state.cityweather !== null && this.state.searchError === 0){
			weather = <h2>Temperature in {this.state.cityweather.name} is {this.state.cityweather.main.temp}°C and current weather is {this.state.cityweather.weather[0].description}.</h2>
			if(!this.state.savedCities.includes(this.state.cityweather.name)){
			button = <SaveButton onClick={this.handleSaveClick.bind(this)} />;
			}
		}
		if(this.state.savedCities !== undefined){
			savedList = ListSavedCities(this.state.savedCities);
		}
		if(this.state.searchError === 1){
			error = <h3 className={classes.Error}>Something went wrong...</h3>;
		}
      return (
        <div>
			<CssBaseline />
        <Modal
			
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={this.state.open}
          onClose={this.handleClose}
        >
          <div style={getModalStyle()} className={classes.Modal}>
		  	<IconButton className={classes.Icon} onClick={this.handleClose}>
            	<CloseIcon  />
        	</IconButton>
			<div className={classes.Warning}>
            <h2 className={classes.Error}>Enter city name</h2>
			</div>
          </div>
        </Modal>
        <div className={classes.Container}>
        <div className={classes.SearchForm}>
		<h2>Enter city name to search for current weather</h2>
        <form onSubmit={this.handleSubmit}>
          <TextField
          id="city"
          label="City"
          value={this.state.value}
          onChange={this.handleChange}
          margin="normal"
        />
        <Button className={classes.Button} type="submit" value="Submit" variant="contained" color="primary">Search</Button>
          
        </form>
		{error}
		{weather}
		{button}
		
		</div>
		<div className={classes.SavedCities}>
		{savedList}
		</div>
		</div>
		
        </div>
      );
    }
  }

  App.propTypes = {
	classes: PropTypes.object.isRequired,
  };

  export default withStyles(styles)(App);