import React, { Component } from 'react';
import { DoubleBounce } from 'better-react-spinkit'

// Loading container styles in Listings.scss

class Loading extends Component {
  render() {
    return (
      <div className="loadingContainer">
        <DoubleBounce
          className="loadingContent"
          color="#FC966C"
          size={50}
        />
      </div>
    );
  }
}

export default Loading