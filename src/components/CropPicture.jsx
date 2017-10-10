// Node Modules
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux'
import Dropzone from 'react-dropzone'
import Cropper from 'react-cropper'
import PropTypes from 'prop-types'
import 'cropperjs/dist/cropper.css'

// Components
import ProfileBubble from './profile/ProfileBubble.jsx'

// Actions
import { save_profile_pic } from '../actions/user.js'

// Styles
import './styles/CropPicture.scss'

export class CropPicture extends Component {
  state = {
    profilePicture: false,
    pictureURL: '',
    editMode: false,
    preview: null
  }

  componentWillMount() {
    const { profile_picture } = this.props.user.info
    console.log(profile_picture)
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
    this.setState({ editMode: false })
    this.props.toggleLoading()
    const data = {
      userId: this.props.user.info.id,
      image: this.refs.cropper.getCroppedCanvas().toDataURL()
    }
    this.props.save_profile_pic(data)
    .then(data => {
      window.location.reload(true)
    })
    .catch(err => {
      console.log(err)
    }) 
  }

  onCancel = () => {
    this.setState({ editMode: false })
  }

  render() {
    return (
      <div>
        <Dropzone
          onDrop={this.onDrop}
          accept="image/*"
          style={{display: 'inline'}}>
          {this.state.profilePicture 
            ? <img src={this.state.preview || this.state.pictureURL } className='profilePictureBubble' alt=''/> 
            : <ProfileBubble editMode center/>
          }
        </Dropzone>
        {this.state.editMode && (
          <div className="cropContainer">
            <Cropper
            ref='cropper'
            src={this.state.profilePicture}
            style={{height: 300, width: 300, margin: '20px auto'}}
            aspectRatio={9 / 9}
            guides={false}
            />
            <button onClick={this.onSave}>
              Save
            </button>
            <button onClick={this.onCancel}>
              Cancel
            </button>
          </div>
        )}
      </div>
    )
  }
}
function mapStateToProps(state){
  return {
    user: state.user
  }
}

CropPicture.contextTypes = {
  router: PropTypes.object.isRequired
}

export default withRouter(connect(mapStateToProps, { save_profile_pic })(CropPicture))
