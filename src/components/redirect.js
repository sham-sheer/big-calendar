import React from 'react';
import queryString from 'query-string';
import { Redirect } from 'react-router';


class OutLookRedirect extends React.Component {
  state = {
    access_token: ''
  }
  componentDidMount() {
    const accessToken = queryString
                        .parse(this.props.location.hash)
                        .access_token;
    this.setState({
      access_token: accessToken
    })
    window.localStorage.setItem('at', accessToken);
  }

  renderRedirect = () => {
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

  render() {
    return (
      <div>
        {this.renderRedirect()}
      </div>
    )
  }
}

export default OutLookRedirect;
