import React, { Component } from 'react'
import Loading from './Loading.jsx'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import FontAwesome from 'react-fontawesome'
import { getListingsByQuery } from '../actions/listing'
import mapStateToProps from '../utils/redux.js'

import './styles/ListingSearch.scss'

class ListingSearch extends Component {
  state = {
    isLoading: true,
    noListings: false,
    pivot: null,
    listings: []
  }

  componentDidMount = () => {
    window.addEventListener('scroll', this.handleScroll)
  }

  componentWillUnmount = () => {
    window.removeEventListener('scroll', this.handleScroll)   
  }

  componentWillMount() {
    this.fetchListings()
  }

  fetchListings = () => {
    const query = this.props.match.params[0]
    const { pivot } = this.state
    this.props.getListingsByQuery(query, pivot)
    .then(res => {
      this.setState({ isLoading: false })
      if(res.data.length > 0) {
        const pivot = res.data[(res.data.length - 1)]._id
        const listings = [...this.state.listings, ...res.data]
        this.setState({ pivot, listings })
      }
      else {
        if(res.data.length < 10){
          this.setState({ noListings: true })
          window.removeEventListener('scroll', this.handleScroll)  
        }
      }
    })
    .catch(err => {
      this.setState({ error: {request: 'Failed to fetch listings' }, isLoading: false })
    })
  }

  handleScroll = () => {
    const windowHeight = 'innerHeight' in window ? window.innerHeight : document.documentElement.offsetHeight
    const body = document.body
    const html = document.documentElement
    const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight)
    const windowBottom = windowHeight + window.pageYOffset
    windowBottom >= docHeight && this.fetchListings()
  }

  render() {
    return (
      <div className='listingSearchContainer'>
        <h1>Results for {this.props.match.params[0]}</h1>
        <hr/><br/>  
        <div className='userListingContainer'>
          <div className='listingSearchContent'>
            {this.state.listings.map((listing, key) => {
              return  (
                <div className='listingSearchItem' key={key}>
                  <Link to={`/listing/${listing._id}`} className='linkStyle'>
                    <img src={listing.photos.length > 0 ? listing.photos[0].image : 'http://via.placeholder.com/100x100' } alt='' />
                    <p>{listing.name}</p>
                    <p>{listing.price}</p>
                  </Link>
                </div>
              )
            })}
          </div>
          {this.state.isLoading && <Loading message="Searching..."/>}
          {this.state.noListings &&
            <div>  
              <h2>That's all you got <span role='img'>🅱️ </span></h2>
              <FontAwesome name='arrow-up' onClick={this.scrollUp}/>
              <br/><br/><br/><br/>
            </div>
          }
      </div>
    </div>
    )
  }
}

export default connect(mapStateToProps, { getListingsByQuery })(ListingSearch)