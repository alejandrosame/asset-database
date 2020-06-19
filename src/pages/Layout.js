import React from 'react';
import { connect } from 'react-redux';

import Toolbar from 'components/navigation/Toolbar';

import classes from './Layout.module.css';

class Layout extends React.Component {


  render(){
    return (
      <React.Fragment>
        <Toolbar {...this.props}/>
        <main className={classes.Content}>
          {this.props.children}
        </main>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.token !== null,
    isAdmin: state.auth.isAdmin,
    username: state.auth.username
  }
}

export default connect(mapStateToProps)(Layout);
