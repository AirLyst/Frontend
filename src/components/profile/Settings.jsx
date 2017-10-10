import React, { Component } from 'react'
import Select from 'react-select' 
import { connect } from 'react-redux'
import FontAwesome from 'react-fontawesome'
import { states } from '../data/Sizing'

import './styles/Settings.scss'

class Settings extends Component {
  state = {
    fullName: "",
    city: "",
    selectedState: "",
    croppedImg: "",
  }

  componentWillMount() {
    console.log(this.props)
    if(this.props.user.info) {
      const { firstName, lastName } = this.props.user.info

      this.setState({
        fullName: `${firstName} ${lastName}`
      })
    }

  handleUpdate = (e) => {
    e.preventDefault()
    alert('called')
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value })
  }
  onSelect = e => {
    this.setState({ selectedState: e.value })
  }
  crop = () => {
    this.setState({ croppedImg: this.refs.cropper.getCroppedCanvas().toDataURL()})
  }
  render() {
    return (
      <div className="settingsContainer">
      <p>Update your settings.</p>
      <hr />
      <div className='profilePicContainer'>
      </div>
        <form className="settingsForm" onSubmit={this.handleUpdate}>
          <div className="formInner">
          <input 
            onChange={this.onChange} 
            type="text" 
            value={this.state.fullName} 
            name="fullName"
            placeholder="Full Name"/>
          <input 
            onChange={this.onChange} 
            type="text" 
            value={this.state.city} 
            name="city"
            placeholder="City"/>
          <Select
            name="state"
            placeholder="State"
            className="settingsSelect selectState"
            value={this.state.selectedState}
            options={states}
            onChange={this.onSelect}
          />
          <button type="submit" className="subBtn"><FontAwesome name="check" type="submit"/></button>
          </div>
        </form>
      </div>
    );
  }
}

function mapStateToProps(state){
  return {
    user: state.user
  }
}

export default connect(mapStateToProps)(Settings)