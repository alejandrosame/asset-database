import React from 'react';

import classes from './Layout.module.css';

class Layout extends React.Component {

  render(){
    return (
      <React.Fragment>
        <header className={classes.Header}>
          <h1> Arcknight monsters </h1>
        </header>
        <main className={classes.Content}>
          {this.props.children}
        </main>
      </React.Fragment>
    );
  }
}

export default Layout;
