import React, { Component } from 'react';
import { withRouter, NavLink, Route } from 'react-router-dom';
import { connect } from 'react-redux'

// Components
import Listings from './profile/Listings.jsx'
import Clout from './profile/Clout.jsx'
import Messages from './profile/Messages.jsx'
import Settings from './profile/Settings.jsx'
import Loading from './Loading.jsx'
import CropPicture from './CropPicture.jsx'

import './styles/Profile.css'

class Profile extends Component {
  state = {
    isLoading: false
  }
  toggleLoading = () => {
    this.setState({ isLoading: !this.state.isLoading })
  }
  render() {
    return (
      <div>
      {
        this.state.isLoading
        ? <Loading />
        :
        <div className="profileContainer">
          <br /><br />
          <CropPicture toggleLoading={this.toggleLoading}/>
          <br />
          <h3>{`${this.props.user.info.firstName} ${this.props.user.info.lastName}`}</h3>
          <hr />
          <div className="catContainer">
            <span className="catContent">
            {categories.map((category, key) => {
              return (
                <NavLink
                  key={key}
                  to={`/profile/${category.toLowerCase()}`}
                  className="catLinks"
                  activeClassName="catLinks active">
                  {category}
                </NavLink>
              )
            }
            )}
            </span>
          </div>
          <Route exact path="/profile" component={Listings}/>
          <Route path="/profile/listings" component={Listings}/>
          <Route path="/profile/clout" component={Clout}/>
          <Route path="/profile/messages" component={Messages}/>
          <Route path="/profile/Settings" component={Settings}/>
        </div>
      }
      </div>
    );
  }
}

const categories = [
  "Listings",
  "Clout",
  "Messages",
  "Settings"
]

function mapStateToProps(state){
  return {
    user: state.user
  }
}

export default withRouter(connect(mapStateToProps)(Profile))
