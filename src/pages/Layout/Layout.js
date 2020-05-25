import React from 'react';
import { connect } from 'react-redux';

import Toolbar from 'components/Navigation/Toolbar/Toolbar';

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
  }
}

export default connect(mapStateToProps)(Layout);
