import React from 'react';
import queryString from 'query-string';
import { Redirect } from 'react-router';
import { connect } from 'react-redux';
import { successOutlookAuth } from '../actions/auth';

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
