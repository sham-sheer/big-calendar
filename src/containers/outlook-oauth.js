import React from 'react';
import queryString from 'query-string';
import { Redirect } from 'react-router';


class OutLookOAuth extends React.Component {
  state = {
    access_token: ''
  }
  componentDidMount() {
    const accessHash = queryString.parse(this.props.location.hash);
    const accessToken = accessHash.access_token;
    this.setState({
      access_token: accessHash.access_token
    })
    window.localStorage.setItem('at', accessToken);
  }

  render() {
      if(this.state.access_token !== '') {
        return (
          <Redirect to="/" />
        )
      }
      else {
        return (
          <div>Loading...</div>
        )
      }
  }
}

export default OutLookOAuth;
