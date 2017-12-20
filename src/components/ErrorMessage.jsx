import React, { Component } from 'react';

import './styles/ErrorMessage.scss'

class ErrorMessage extends Component {
  render() {
    return (
      <div className='errorContainer'>
        <p>{this.props.text}</p>
      </div>
    );
  }
}

export default ErrorMessage