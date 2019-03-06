import React from 'react';
import queryString from 'query-string';
import { Redirect } from 'react-router';
import { connect } from 'react-redux';
import { successOutlookAuth } from '../actions/auth';

import { Client } from '@microsoft/microsoft-graph-client';
import { getAccessToken } from '../utils/client/outlook';

const mapDispatchToProps = dispatch => ({
  successOutlookAuth: (user) => dispatch(successOutlookAuth(user))
});

const mapStateToProps = state => {
  return {
    isAuth: state.auth.currentUser,
  };
};

class OutLookRedirect extends React.Component {
  state = {
    access_token: ''
  }

  componentDidMount() {
    const response = queryString
      .parse(this.props.location.hash);
    const accessToken = response.access_token;

    let currentUser = {user: {
      access_token: accessToken,
    }};

    this.setState({
      currentUser: currentUser,
      access_token: accessToken
    });

    var expiresin = (parseInt(response.expires_in) - 300) * 1000;
    var now = new Date();
    var expireDate = new Date(now.getTime() + expiresin);
  
    window.localStorage.setItem('outlook_access_token', accessToken);
    window.localStorage.setItem('outlook_expiry', expireDate.getTime());
    window.localStorage.setItem('outlook_id_token', response.id_token);

    getAccessToken((accessToken) => {
      if (accessToken) {
        // Create a Graph client
        var client = Client.init({
          authProvider: (done) => {
            // Just return the token
            done(null, accessToken);
          }
        });
  
        var id = "";
        
        // This first select is to choose from the list of calendars 
        client
          .api('/me')
          .select('*')
          .get(async (err, res) => {
            if (err) {
              console.log(err);
            } else {
              console.log(JSON.stringify(res));
            }
          });
      } else {
        var error = { responseText: 'Could not retrieve access token' };
        console.log(error);
      }
    });

    this.props.successOutlookAuth(currentUser);
  }

  renderRedirect = () => {
    if(this.state.currentUser !== null) {
      return (
        <Redirect to="/" />
      );
    }
    else {
      return (
        <div>Loading...</div>
      );
    }
  }

  render() {
    return (
      <div>
        {this.renderRedirect()}
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OutLookRedirect);
