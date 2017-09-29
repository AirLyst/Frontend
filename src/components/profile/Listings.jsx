import React, { Component } from 'react';

class Listings extends Component {
  render() {
    return (
      <div>
        {listingTypes.map((listing, key) => {
          return (
            <div className="cardContainer" key={key}>
              <div className="card">
                <span className="cardContent">
                  <h3>{listing}</h3>
                  <hr/>
                </span>
              </div>
              <br/>
              <br/>
            </div>
          )
        })
        }
    </div>
    )
  }
}

const listingTypes = [
  "Your Listings",
  "Watching",
  "Expired"
]

export default Listings