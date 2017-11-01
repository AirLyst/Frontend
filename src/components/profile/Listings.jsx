import React, { Component } from 'react';
import { connect } from 'react-redux'
import axios from 'axios'
import FontAwesome from 'react-fontawesome'

import mapStateToprops from '../../utils/redux.js'

class Listings extends Component {
  state = {
    listings: [],
    noListings: false,
    firstId: 'first',
    lastId: 'last',
    allowNext: true,
    allowPrevious: false,
    isLoading: false,
    errors: {
      request: null
    },
    pageNumber: 0
  }

  componentWillMount = () => {
    this.fetchListings()
  }
  

  fetchListings = direction => {
    this.setState({ isLoading: true })
    let pivot
    direction ? (pivot = direction) : (pivot = 'null/null')
    pivot === 'next' && (pivot = `${this.state.lastId}/next`) 
    pivot === 'previous' && (pivot = `${this.state.firstId}/previous`)

    axios.get(`/api/listing/user/${this.props.user.info.id}/${pivot}`)
    .then(res => {
      console.log(res.data)
      this.setState({ isLoading: false })
      if(res.data.length > 0) {
        const lastId = res.data[res.data.length - 1]._id
        const firstId = res.data[0]._id
        console.log(`first: ${firstId}, last: ${lastId}`)
        this.setState({ listings: res.data, firstId, lastId })        
      }
      else {
        if(!direction && res.data.length === 0)
          this.setState({ allowNext: false, allowPrevious: false, noListings: true })
        if(res.data.length < 10)
          this.setState({ allowNext: false })
      }
    })
    .catch(err => {
      this.setState({ error: {request: 'Failed to fetch listings' }, isLoading: false })
    })
  }

  previousPage = () => {
    const pageNumber = this.state.pageNumber - 1
    if(pageNumber === 0)
      this.setState({ pageNumber, allowPrevious: false })
    this.setState({ pageNumber })
    this.fetchListings('previous')
  }

  nextPage = () => {
    const pageNumber = this.state.pageNumber + 1
    this.setState({ pageNumber, allowPrevious: true })
    this.fetchListings('next')
  }
  
  render() {
    return (
      <div className='userListingContainer'>
      <h1>Page Number: {this.state.pageNumber} </h1>
      {this.state.allowPrevious &&
        <div>
          <FontAwesome name='arrow-left' onClick={this.previousPage} />Previous
        </div>
      }
      {this.state.allowNext &&
        <div>
          <FontAwesome name='arrow-right' onClick={this.nextPage} />Next
        </div>
      }
      {this.state.noListings && <h2>You don't have anything for sale ):</h2>}
        <div className='userListings'>
          {this.state.listings.map((listing, key) => {
            return  (
              <div key={key} className='userListing'>
                {listing.photos.length > 0 && <img src={listing.photos[0].image} alt=''/> }
                <p>{listing.name}</p>
              </div>
            )
          })}
        </div>
      </div>
    )
  }
}
export default connect(mapStateToprops)(Listings)