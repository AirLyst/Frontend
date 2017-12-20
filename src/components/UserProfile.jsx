import React, { Component } from 'react'
import { connect } from 'react-redux'
import mapStateToProps from '../utils/redux'
import { getUser } from '../actions/user'
import { getUserListings } from '../actions/listing'
import { Link } from 'react-router-dom'
import Scroll from 'react-scroll'
import { RotatingPlane } from 'better-react-spinkit'
import FontAwesome from 'react-fontawesome'
import Loading from './Loading.jsx'

import ProfileBubble from './profile/ProfileBubble'

import './styles/UserProfile.scss'


class UserProfile extends Component {

  state = {
    user: {

    },
    listings: [],
    pivot: null,
    hasProfilePicture: false,
    noListings: false,
    isLoading: true
  }
    
  componentDidMount = () => {
    window.addEventListener('scroll', this.handleScroll)
  }

  componentWillUnmount = () => {
    window.removeEventListener('scroll', this.handleScroll)   
  }

  componentWillMount = () => {
    const userId = this.props.match.params[0]
    this.props.getUser(userId)
    .then(res => {
      if(res.data.profile_picture.length > 5){
        this.setState({ user: res.data, hasProfilePicture: true })     
      } else {
        this.setState({ user: res.data})
      }
      this.fetchListings()
    })
    .catch(err => {
      console.log(err)
    })
  }

  fetchListings = () => {
    this.setState({ isLoading: true })
    const userId = this.props.match.params[0]
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
      <div>
        {this.state.isLoading
          ? <Loading />
          : <div className='userProfileContainer'>
              <span className='userInformation'>
                {this.state.hasProfilePicture 
                  ? <img src={this.state.user.profile_picture} alt=''/> 
                  : <ProfileBubble />
                }
                <h1>{`${this.state.user.firstName} ${this.state.user.lastName}`}</h1>
              </span>
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
                {this.state.isLoading && <span className='listingLoading'><RotatingPlane size={50} color='#F29B70'/></span>}
                {this.state.noListings &&
                  <div>  
                    <h2>That's all you got 🅱️</h2>
                    <FontAwesome name='arrow-up' onClick={this.scrollUp}/>
                    <br/><br/><br/><br/>
                  </div>
                }
            </div>
          </div>
          }
      </div>
    )
  }
}

export default connect(mapStateToProps, { getUser, getUserListings })(UserProfile)
