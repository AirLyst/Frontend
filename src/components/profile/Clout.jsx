import React, { Component } from 'react';

import './styles/Clout.css'

class Clout extends Component {
  state = {
    cloutTokens: 12,
    toComplete: 2,
    pending: 1,
  }

  componentWillMount() {
    // Fetch clout from Db
  }

  render() {
    return (
      <div>
        <div className="cloutContainer"> 
          <div className="cloutFlexItem">
            <h1>{this.state.cloutTokens}</h1>
            <h3>Clout Tokens</h3>
          </div>
          <div className="cloutFlexItem">
            <h1>{this.state.toComplete}</h1>
            <h3>To Review</h3>
          </div>
          <div className="cloutFlexItem">
            <h1>{this.state.pending}</h1>
            <h3>Pending</h3>
          </div>
        </div>
        <div className="cardContainer">
          <div className="card">
            <span className="cardContent">
              <h3>Clout</h3>
              <hr/>
            </span>
          </div>
          <br/>
          <br/>
        </div>
      </div>
    );
  }
}

export default Clout