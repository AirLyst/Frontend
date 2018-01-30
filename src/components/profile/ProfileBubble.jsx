import React, { Component } from 'react';
import { withRouter }       from 'react-router-dom';
import { connect }          from 'react-redux'

// Takes two props. <ProfileBubble small center/>
class ProfileBubble extends Component {
  state = {
    bubbleStyle: ""
  }
  componentWillMount() {
    if(this.props.user) {
      const { firstName, lastName } = this.props.user.info

      this.setState({
        fullName: `${firstName} ${lastName}`
      })
    }
    if(this.props.small) {
      this.setState({ bubbleStyle: "small"})
    }
    if(this.props.center) {
      let { bubbleStyle } = this.state
      bubbleStyle = `${bubbleStyle} center`
      this.setState({ bubbleStyle })
    }
    if(this.props.editMode) {
      let { bubbleStyle } = this.state
      bubbleStyle = `${bubbleStyle} edit`
      this.setState({ bubbleStyle })
    }
  }
  render() {
    return (
      <div className={`profileBubble ${this.state.bubbleStyle}`}>
        {this.props.user.info.firstName && this.props.user.info.firstName[0]}
      </div>
    )
  }
}


function mapStateToProps(state){
  return {
    user: state.user
  }
}

export default withRouter(connect(mapStateToProps)(ProfileBubble))