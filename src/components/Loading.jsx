import React, { Component } from 'react';
import { RotatingPlane } from 'better-react-spinkit'
import PropTypes from 'prop-types';

import './styles/Loading.scss'

class Loading extends Component {
  render() {
    return (
      <div className={this.props.half ? "loadingContainer viewport-half" : "loadingContainer"}>
        <div className="loadingContent">
          <span className="loadingAnimation">
            <RotatingPlane
              className="loadingAnimation"
              color="#FC966C"
              size={50}
            />
          </span>
          <h3>{this.props.message}</h3>
        </div>
      </div>
    );
  }
}

Loading.propTypes = {
  message: PropTypes.string,
  half: PropTypes.bool
}

export default Loading