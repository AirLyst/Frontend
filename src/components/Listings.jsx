import React, { Component } from 'react';
import PropTypes      from 'prop-types'
import axios from 'axios'
import { Link } from 'react-router-dom'



// Components
import ImageCard from './ItemImage.jsx'
import Loading from './Loading.jsx'

import './styles/Listings.scss'

class Listings extends Component {
  state = {
    listing: {
      photos: []
    },
    user: '',
    isLoading: true
  }
  componentWillMount = async () => {
    console.log(this.props)
    const listingID = this.props.match.params[0]
    await axios.post('http://localhost:4000/api/listing/id', { _id: listingID })
    .then(res => {
      this.setState({ 
        listing: res.data, 
        isLoading: false
      })
    })
    await axios.get(`http://localhost:4000/api/user/${this.state.listing.user}/name`)
    .then(res=> { 
      console.log(res.data, res)
      this.setState({ user: res.data })
    })
  }
  render() {
    return (
      <div>
        {
          this.state.isLoading ? <Loading /> : (
          <div className="listingPageContainer">
            <h1>{this.state.listing.name}</h1>
            <h4>listed by: {this.state.user}</h4>
            <hr />
            <div className="listingInfoContainer">
              <span>
                <h3>Brand</h3>
                <p className='listingTag'>{this.state.listing.brand}</p>
              </span>
              <span>
                <h3>Price</h3>
                <p className='listingTag-price'>${this.state.listing.price}<span className='listingTag-end' /></p>
              </span>
              <span>
                <h3>Size</h3>
                <p className='listingTag'>{this.state.listing.size}</p>
              </span>
              <span>
                <h3>Condition</h3>
                <p className='listingTag'>{this.state.listing.condition}</p>
              </span>
            </div>

            <div className='sellDescription'>
              {this.state.listing.description}  
            </div>            

            <h1>Photos & Descriptions</h1>
            <div className={this.state.listing.photos.length >= 3 ? "listingImageContainer spbetween" : "listingImageContainer sparound"}>
              {this.state.listing.photos.map((photo, key) => {
                return (
                  <span key={key}>
                    <ImageCard 
                      src={photo.image} 
                      description={photo.description} 
                      key={key} 
                      indx={key}
                      onDel={this.onDel}
                      noEdit 
                    />
                  <div className='descriptionCard'>
                    {photo.description}
                  </div>
                  </span>
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