import React from 'react';
import { connect } from 'react-redux';
import { Redirect, Route, Switch } from 'react-router-dom';

import * as actions from 'logic/store/actions';

import Layout from 'pages/Layout/Layout';
import Assets from 'pages/Private/Assets/Assets';
import Images from 'pages/Private/Images/Images';
import Logout from 'pages/Private/Logout/Logout';
import Tags from 'pages/Private/Tags/Tags';
import Users from 'pages/Private/Users/Users';


class Private extends React.Component {

  componentDidMount() {
    this.props.onTryAutoSignup();
  }

  render() {
    let usersRoute = null;
    if (this.props.isAdmin) {
      usersRoute = <Route path={`${this.props.match.path}/users`} exact
        render={() => <Users isAuthenticated={this.props.isAuthenticated}/>}
      />;
    }

    return (
      <Layout {...this.props}>
        <Switch>
          <Route path={`${this.props.match.path}/logout`} exact component={Logout} />
          <Route path={`${this.props.match.path}/images`} exact
            render={() => <Images isAuthenticated={this.props.isAuthenticated}/>}
          />
          {usersRoute}
          <Route path={`${this.props.match.path}/tags`} exact
            render={() => <Tags isAuthenticated={this.props.isAuthenticated}/>}
          />
          <Route path={`${this.props.match.path}`} exact
            render={() => <Assets isAuthenticated={this.props.isAuthenticated}/>}
          />
          <Redirect to={`${this.props.match.path}`} />
        </Switch>
      </Layout>
    );
  }
}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.token !== null,
    isAdmin: state.auth.isAdmin
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onTryAutoSignup: () => dispatch(actions.authCheckState())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Private);
