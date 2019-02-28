import React, { Component } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

const styles = theme => ({
	Header: {
        background: '#64b5f6',
        height: '150px',
        width: '60%',
        margin: '0 auto'
        

    },
    Title: {
        textAlign: 'center',
        padding: '50px'
        
    }
    

});

class Header extends Component {
render(){
    const { classes } = this.props;
    return(
    <div className={classes.Header}>
    <CssBaseline />
        <h1 className={classes.Title}> City Weather </h1>
    </div>
    )
}
}

Header.propTypes = {
	classes: PropTypes.object.isRequired,
  };

  export default withStyles(styles)(Header);