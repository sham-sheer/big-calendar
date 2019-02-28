import React from 'react';
import queryString from 'query-string';
import { Redirect } from 'react-router';


class OutLookRedirect extends React.Component {
  state = {
    access_token: ''
  }
  componentDidMount() {
    const response = queryString
      .parse(this.props.location.hash);
    const accessToken = response.access_token;
    this.setState({
      access_token: accessToken
    });

    var expiresin = (parseInt(response.expires_in) - 300) * 1000;
    var now = new Date();
    var expireDate = new Date(now.getTime() + expiresin);
  
    window.localStorage.setItem('outlook_access_token', accessToken);
    window.localStorage.setItem('outlook_expiry', expireDate.getTime());
    window.localStorage.setItem('outlook_id_token', response.id_token);
  }

  renderRedirect = () => {
    if(this.state.access_token !== '') {
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

export default OutLookRedirect;
