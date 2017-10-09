import React, { Component } from 'react';
import { withRouter, NavLink, Route }       from 'react-router-dom';
import { connect }          from 'react-redux'
import PropTypes      from 'prop-types'
import Dropzone from 'react-dropzone'
import Cropper from 'react-cropper'
import 'cropperjs/dist/cropper.css'

// Components
import ProfileBubble from './profile/ProfileBubble.jsx'
import Listings from './profile/Listings.jsx'
import Clout from './profile/Clout.jsx'
import Messages from './profile/Messages.jsx'
import Settings from './profile/Settings.jsx'
import Loading from './Loading.jsx'

// Actions
import { save_profile_pic } from '../actions/user.js'

import './styles/Profile.css'

class Profile extends Component {
  state = {
    profilePicture: false,
    pictureURL: '',
    editMode: false,
    isLoading: false
  }

  componentWillMount() {
    const { profile_picture } = this.props.user.info
    if(profile_picture !== '')
      this.setState({ 
        profilePicture: true,
        pictureURL: profile_picture
      })
  }

  onDrop = (acceptedFiles, rejectedFiles) => {
    this.setState({ 
      profilePicture: acceptedFiles[0].preview,
      editMode: true
    })
  }

  onSave = () => {
    this.setState({ isLoading: true, editMode: false })
    const data = {
      userId: this.props.user.info.id,
      image: this.refs.cropper.getCroppedCanvas().toDataURL()
    }
    this.props.save_profile_pic(data)
    .then(data => {
      window.location.reload()
    })
    .catch(err => {
      console.log(err)
    }) 
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
          <Dropzone
            onDrop={this.onDrop}
            accept="image/*"
            className="profileInput"
            style={{display: 'inline'}}
          >
            {this.state.profilePicture 
              ? <img src={this.state.pictureURL} className='profilePictureBubble' alt=''/> 
              : <ProfileBubble editMode center/>
            }
          </Dropzone>
          {this.state.editMode && (
            <div>
            <br/>
            <Cropper
            ref='cropper'
            src={this.state.profilePicture}
            style={{height: 300, width: 300, margin: '20px auto'}}
            aspectRatio={9 / 9}
            guides={false}
            />
            <button onClick={this.onSave}>
            Save Profile Pic
            </button>
            </div>
          )}
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

Profile.contextTypes = {
  router: PropTypes.object.isRequired
}

export default withRouter(connect(mapStateToProps, { save_profile_pic })(Profile))
