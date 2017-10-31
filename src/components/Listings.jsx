import React, { Component } from 'react';
import PropTypes      from 'prop-types'
import axios from 'axios'
import FontAwesome from 'react-fontawesome'
import { connect } from 'react-redux'

// Components
import ImageCard from './ItemImage.jsx'
import Loading from './Loading.jsx'

import { newConversation } from '../actions/message.js'

import './styles/Listings.scss'

class Listings extends Component {
  state = {
    listing: {
      photos: []
    },
    isLoading: true,
    message: '',
    initChat: false,
    viewingSelf: false
  }

  componentWillMount() {
    const listingID = this.props.match.params[0]
    axios.get(`http://localhost:4000/api/listing/${listingID}`)
    .then(res => {
      console.log(res)
      this.setState({ 
        listing: res.data, 
        isLoading: false
      })
      if(this.state.listing.user._id === this.props.user.info.id)
        this.setState({ viewingSelf: true })
    })
    .catch(err => {
      console.log(err)
    })
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value })
  }

  startConversation = e => {
    e.preventDefault()
    const recipient = this.state.listing.user._id
    const user = this.props.user.info.id
    const { message } = this.state
    console.log({ user, recipient, message })
    if(message !== '') {
      this.props.newConversation({ user, recipient, message })
      .then(res => {
        // console.log(`/messages/${res.data.conversationId}`)
        this.context.router.history.push(`/messages/${res.data.conversationId}`)
      })
      .catch(err => {
        // failed to start conversation
      })
    }
  }

  toggleMessage = () => {
    this.setState({ initChat: !this.state.initChat })
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

            <div className='sellerInfo'>
              <h1> Seller</h1>
              <hr/>
              {
                !this.state.viewingSelf &&
                <div>
                  <h3 onClick={ this.toggleMessage }>
                    <FontAwesome name='envelope-o' />
                  </h3>
                  {
                    this.state.initChat && 
                      <form onSubmit={this.startConversation}>
                        <input type='text' value={this.message} onChange={this.onChange} name='message'/>
                      </form>
                  }
                </div>
              }

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

function mapStateToProps(state){
  return {
    user: state.user
  }
}

export default connect(mapStateToProps, { newConversation })(Listings)