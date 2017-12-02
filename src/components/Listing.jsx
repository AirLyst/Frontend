// Node Modules
import React, { Component } from 'react';
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import FontAwesome from 'react-fontawesome'
import { Link } from 'react-router-dom'

// Components
import ImageCard from './ItemImage.jsx'
import Loading from './Loading.jsx'

// user Functions
import { newConversation } from '../actions/message.js'
import { getListingById } from '../actions/listing.js'
import mapStateToProps from '../utils/redux.js'

import './styles/Listing.scss'

class Listing extends Component {
  state = {
    listing: {
      photos: []
    },
    isLoading: true,
    message: '',
    initChat: false,
    viewingSelf: false,
    error: {
      request: null
    }
  }

  /**
   * Get the listing ID from the URL then
   * fetch the listing and apply to state.
   * If the current viewer made the post,
   * set viewingSelf to true
   */
  componentWillMount() {
    const listingId = this.props.match.params[0]
    this.props.getListingById(listingId)
    .then(res => {
      this.setState({ 
        listing: res.data, 
        isLoading: false
      })
      if(this.state.listing.user._id === this.props.user.info.id)
        this.setState({ viewingSelf: true })
    })
    .catch(err => {
      this.setState({ error: { request: 'Failed to get listing.'} })
    })
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value })
  }

  startConversation = e => {
    e.preventDefault()
    const recipient = this.state.listing.user._id
    const user = this.props.user.info.id
    const listingId = this.props.match.params[0]
    const { message } = this.state
    if(message !== '') {
      this.props.newConversation({ user, recipient, message, listingId })
      .then(res => {
        this.context.router.history.push(`/messages/${res.data.conversationId}`)
      })
      .catch(err => {
        console.log(err)
        // failed to start conversation
      })
    }
  }

  toggleMessage = () => {
    this.setState({ initChat: !this.state.initChat })
  }

  toggleLike = () => {
    
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

            {
              !this.state.viewingSelf &&
              <div className='sellerInfo'>
                <h1>Interact</h1>
                <hr/>
                <span className='sellerInfoContent'>              
                  <span>
                    <h4 onClick={ this.toggleMessage }>
                      <FontAwesome name='envelope-o' /> Message Seller
                    </h4>
                  </span>  
                    {
                      this.state.initChat && 
                        <form onSubmit={this.startConversation}>
                          <input type='text' value={this.message} onChange={this.onChange} name='message'/>
                        </form>
                    }
                  <span>
                    <Link to={`/user/${this.state.listing.user._id}`} >
                      <FontAwesome name='user-circle-o' /> {this.state.listing.user.firstName}'s Profile
                    </Link>
                  </span>  
                  <span>
                    <h4 onClick={ this.toggleLike }>
                      <FontAwesome name='star-o' /> Save Listing
                    </h4>
                  </span>
                </span>
              </div>
              }

            
            <h1>Photos & Descriptions</h1>
            <hr />
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

Listing.contextTypes = {
  router: PropTypes.object.isRequired
}

export default connect(mapStateToProps, { newConversation, getListingById })(Listing)