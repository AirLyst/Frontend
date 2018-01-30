// Node Modules
import React, { Component } from 'react';
import { connect } from 'react-redux'
import FontAwesome from 'react-fontawesome'
import Scroll from 'react-scroll'
import { Link } from 'react-router-dom'
import { RotatingPlane } from 'better-react-spinkit'

// Actions/Utils
import mapStateToprops from '../../utils/redux.js'
import { getUserListings } from '../../actions/listing.js'

// Styles
import './styles/Listings.scss'

class Listings extends Component {
  state = {
    listings: [],
    noListings: false,
    pivot: null,
    isLoading: false,
    errors: {
      request: null
    }
  }

  componentWillMount = () => {
    this.fetchListings()
  }
  
  componentDidMount = () => {
    window.addEventListener('scroll', this.handleScroll)
  }

  componentWillUnmount = () => {
    window.removeEventListener('scroll', this.handleScroll)   
  }
  

  fetchListings = () => {
    this.setState({ isLoading: true })
    const userId = this.props.user.info.id
    const { pivot } = this.state
    this.props.getUserListings(userId, pivot)
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

  /**
   * http://blog.sodhanalibrary.com/2016/08/detect-when-user-scrolls-to-bottom-of.html#.WftmORNSyL4
   */
  handleScroll = () => {
    const windowHeight = 'innerHeight' in window ? window.innerHeight : document.documentElement.offsetHeight
    const body = document.body
    const html = document.documentElement
    const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight)
    const windowBottom = windowHeight + window.pageYOffset
    windowBottom >= docHeight && this.fetchListings()
  }

  scrollUp = () => {
    Scroll.animateScroll.scrollToTop()
  }

  render() {
    return (
      <div className='userListingContainer'>
        <h3>These are your active listings</h3>
        <div className='userListings'>
          {this.state.listings.map((listing, key) => {
            return  (
              <div className='userListing' key={key}>
                <Link to={`/listing/${listing._id}`} className='linkStyle'>
                  <img src={listing.photos.length > 0 ? listing.photos[0].image : 'http://via.placeholder.com/100x100' } alt='' />
                  <p>{listing.name}</p>
                </Link>
              </div>
            )
          })}
        </div>
        {this.state.isLoading && <span className='listingLoading'><RotatingPlane size={50} color='#F29B70'/></span>}
        {this.state.noListings &&
          <div>  
            <h2>That's all for now.</h2>
            <FontAwesome name='arrow-up' onClick={this.scrollUp}/>
            <br/><br/><br/><br/>
          </div>
        }
      </div>
    )
  }
}
export default connect(mapStateToprops,{ getUserListings })(Listings)
