import React from 'react';
import { connect } from 'react-redux';
import { Redirect, Route, Switch } from 'react-router-dom';

import * as actions from '../../store/actions';

import AddAssets from '../../components/AddAssets/AddAssets';
import Assets from './Assets/Assets';
import Layout from '../../containers/Layout/Layout';
import Logout from '../../components/Auth/Logout/Logout';
import Tags from '../../components/Tags/Tags';
import Users from '../../components/Users/Users';


class Private extends React.Component {

  componentDidMount() {
    this.props.onTryAutoSignup();
  }

  render() {
    return (
      <Layout>
        <Switch>
          <Route path={`${this.props.match.path}/logout`} exact component={Logout} />
          <Route path={`${this.props.match.path}/users`} exact render={() => {
            return(
              <React.Fragment >
                <h1>Welcome to private area</h1>
                <Users isAuthenticated={this.props.isAuthenticated}/>
              </React.Fragment>
            );}}
           />
          <Route path={`${this.props.match.path}/tags`} exact render={() => {
            return(
              <React.Fragment >
                <h1>Welcome to private area</h1>
                <Tags isAuthenticated={this.props.isAuthenticated}/>
              </React.Fragment>
            );}}
           />
         <Route path={`${this.props.match.path}/add-assets`} exact render={() => {
           return(
             <React.Fragment >
               <h1>Welcome to private area</h1>
               <AddAssets isAuthenticated={this.props.isAuthenticated}/>
             </React.Fragment>
           );}}
          />
          <Route path={`${this.props.match.path}`} exact render={() => {
            return(
              <React.Fragment >
                <h1>Welcome to private area</h1>
                <Assets isAuthenticated={this.props.isAuthenticated}/>
              </React.Fragment>
            );}}
           />
          <Redirect to={`${this.props.match.path}`} />
        </Switch>
      </Layout>
    );
  }
}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.token !== null
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onTryAutoSignup: () => dispatch(actions.authCheckState())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Private);
