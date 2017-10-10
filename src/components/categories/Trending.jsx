import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import axios from 'axios'
import AnimatedBox  from '../reusable/AnimatedBox.jsx'

import '../styles/Trending.css'

class Trending extends Component {
  state = {
    recentItems: []
  }
  componentWillMount() {
    const quantity = { quantity: 16 }
    axios.post('http://localhost:4000/api/listing/recents', quantity)
    .then(res => {
      console.log(res.data)
      let { recentItems } = this.state
      recentItems = [...recentItems, ...res.data]
      this.setState({ recentItems: recentItems })
    })
    .catch(err => console.log(err.message))
  }
  render() {

    return (
      <div>
        <AnimatedBox />
        <div className="hotContainer">
          <h1>New Gear</h1>
          <hr />
            <div className="hotItems">
              {
                this.state.recentItems.map((item, key) => {
                  return (
                    <div key={key} className="imgContainer">
                      <div className="imgPreview no-hover">
                        <Link to={`/listings/${item._id}`}>
                        <img
                          src={item.photos[0].image || null} 
                          alt={item.brand}
                          className="imgContent"
                          />
                        </Link>
                        <p>{item.name}</p>
                        <p style={{color: 'rgb(200,200,200)'}}>${item.price}</p>
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
