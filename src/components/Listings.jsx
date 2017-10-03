import React, { Component } from 'react';
import PropTypes      from 'prop-types'
import axios from 'axios'



// Components
import ImageCard from './ItemImage.jsx'
import Loading from './Loading.jsx'

import './styles/Listings.scss'

class Listings extends Component {
  state = {
    listing: {
      photos: []
    },
    isLoading: true
  }
  componentWillMount() {
    const regExp = new RegExp('(?:.*?\\/){2}(.*)', 'g')
    const listingID = regExp.exec(this.context.router.history.location.pathname)[1]
    axios.post('http://localhost:4000/api/listing/id', { _id: listingID })
    .then(res => {
      console.log(res.data)
      this.setState({ 
        listing: res.data, 
        isLoading: false
      })
    })
  }
  render() {
    return (
      <div>
        {
          this.state.isLoading ? <Loading /> : (
          <div className="listingPageContainer">
            <h1>{this.state.listing.name}</h1>
            <hr />
            <div className="listingInfoContainer">
              <span>
                <h3>Brand</h3>
                <p>{this.state.listing.brand}</p>
              </span>
              <span>
                <h3>Price</h3>
                <p>${this.state.listing.price}</p>
              </span>
              <span>
                <h3>Size</h3>
                <p>{this.state.listing.size}</p>
              </span>
              <span>
                <h3>Condition</h3>
                <p>{this.state.listing.condition}</p>
              </span>
            </div>
            <h1>Photos & Descriptions</h1>
            <hr />
            <div className="listingImageContainer">
              {this.state.listing.photos.map((photo, key) => {
                return (
                  <ImageCard 
                    src={photo.image} 
                    key={key} 
                    indx={key} 
                    onDel={this.onDel}
                    noEdit 
                  />
                )
              })}
            </div>
          </div>
          )
      }
      </div>
    )
  }
}

Listings.contextTypes = {
  router: PropTypes.object.isRequired
}

export default Listings