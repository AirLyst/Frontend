import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import axios from 'axios'
import { RotatingPlane } from 'better-react-spinkit'

import './styles/Recents.scss'

class Recents extends Component {
  state = {
    recentItems: [],
    isLoading: true
  }
  componentWillMount() {
    if (this.props.query === 'recents') {
      this.setState({ query: 'recents', header: 'Recent Listings' })
    }
    axios.get('/api/listing/recents/8')
    .then(res => {
      console.log(res.data)
      let { recentItems } = this.state
      recentItems = [...recentItems, ...res.data]
      this.setState({ recentItems: recentItems, isLoading: false })
    })
    .catch(err => console.log(err.message))
  }
  render() {

    return (
      <div>
        <div className="recentContainer">
          <span className='recentHeader'>
            <h1>Recent Listings</h1>
            <p>See More ></p>
          </span>
          {
            this.state.isLoading
            ? <span className='recentLoadingContainer'>
                <span className='recentLoadingContent'>
                  <RotatingPlane color='#FC956C' size={50}/>
                </span>
              </span>
            : <div className="itemGridContainer">
                {
                  this.state.recentItems.map((item, key) => {
                    return (
                      <div key={key} className="itemImageContainer">
                        <div >
                          <Link to={`/listing/${item._id}`}>
                          <img
                            src={item.photos.length > 0 ? item.photos[0].image : 'http://via.placeholder.com/150x150'}
                            alt={item.brand}
                            />
                          </Link>
                          <div className='itemDetails'>
                            <p>{item.brand.charAt(0).toUpperCase() + item.brand.slice(1)} &bull; {item.condition.toUpperCase()} &bull; {item.size.toUpperCase()}</p>
                            <h3>{item.name}</h3>
                            <span className='itemPriceLikes'>
                              <p className='itemPrice'>${item.price}</p>
                              <span>
                                <p>{item.liked} Likes</p>
                              </span>
                            </span>
                          </div>
                        </div>
                      </div>
                    )
                  })
                }
              </div>
          }

        </div>
      </div>
    )
  }
}

export default Recents
