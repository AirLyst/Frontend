import React, { Component } from 'react';
import FontAwesome from 'react-fontawesome'

class Filter extends Component {
  render() {
    return (
      <div style={{animation: this.props.animation}}>
          <div className="showContent" >
            <h1>Filter</h1>
            <hr/>
            <FontAwesome 
              name="check-circle"
              onClick={this.props.hideFilter}
              id="filterArrow"
            />
          </div>
      </div>
    )
  }
}

export default Filter