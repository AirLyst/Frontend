import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import axios from 'axios'
// import AnimatedBox  from '../reusable/AnimatedBox.jsx'

import '../styles/Trending.css'

class Trending extends Component {
  state = {
    recentItems: []
  }
  componentWillMount() {
    axios.get('http://localhost:4000/api/listing/recents/6')
    .then(res => {
      let { recentItems } = this.state
      recentItems = [...recentItems, ...res.data]
      this.setState({ recentItems: recentItems })
    })
    .catch(err => console.log(err.message))
  }
  render() {

    return (
      <div>
        <div className="hotContainer">
          <h1>New Gear</h1>
          <hr />
            <div className="hotItems">
              {
                this.state.recentItems.map((item, key) => {
                  return (
                    <div key={key} className="imgContainer">
                      <div className="imgPreview no-hover">
                        <Link to={`/listing/${item._id}`}>
                        <img
                          src={item.photos[0].image || null} 
                          alt={item.brand}
                          className="imgContent"
                          />
                        </Link>
                        <p>{item.name}</p>
                      </div>
                    </div>
                  )
                })
              }
            </div>
        </div>
      </div>
    )
  }
}

export default Trending
