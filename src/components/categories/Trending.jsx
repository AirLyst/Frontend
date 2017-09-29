import React, { Component } from 'react';

import AnimatedBox  from '../reusable/AnimatedBox.jsx'

import '../styles/Trending.css'

class Trending extends Component {
  render() {

    return (
      <div>
        <AnimatedBox />
        <div className="hotContainer">
          <h1>New Gear</h1>
          <hr />
            <div className="hotItems">
              {
                sampleItems.map((item, key) => {
                  return (
                    <span key={key} className="item">
                      <img src="http://via.placeholder.com/120x120" alt={item}/>
                      <p>{item}</p>
                    </span>
                  )
                })
              }
            </div>
        </div>
      </div>
    )
  }
}

    const sampleItems = [
      "Please",
      "Don't",
      "Touch",
      "My",
      "Raf",
      "Place",
      "Holder",
      "Yuhhhh"
    ]

export default Trending
