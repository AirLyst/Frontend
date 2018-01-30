// Node Modules
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import FontAwesome from 'react-fontawesome'
import { connect } from 'react-redux'
import { Link, Redirect } from 'react-router-dom'
import Waypoint from 'react-waypoint'

// User Functions
import { getChat, sendMessage, getMoreMessages } from '../../actions/message.js'
import socket from '../../utils/socket.js'
import mapStateToProps from '../../utils/redux.js'

// Styles
import './styles/Chat.scss'

class Chat extends Component {
  state = {
    messages: [],
    body: '',
    otherUser: {
      firstName: '',
      lastName: '',
      profile_picture: ''
    },
    listing: {
      photos: [{image: ''}]
    },
    conversationId: '',
    pivot: null,
    stickyPoint: null
  }

  /**
   * Get the conversation ID from the url.
   * GET request to get the chat transcript,
   * then parse the messages to differentiate
   * who sent the message
   */
  componentWillMount = () => {
    const conversationId = this.props.match.params[0]
    const _id = this.props.user.info.id
    // Set conversationId because componentDidMount and other
    // functions depends on this variable
    this.setState({ conversationId })
    this.props.getChat({conversationId, _id})
    .then(res => {
      // Parse the messages to differentiate who sent the message
      let pivot = null
      if(res.data.messages.length >= 20) {
        pivot = res.data.messages[0]
      }
      let messages = res.data.messages.map(message => {
        if(message.author === this.props.user.info.id)
          return { sender: 'You', body: message.body }
        else
          return { sender: res.data.user.firstName , body: message.body }
      })
      this.setState({ messages, otherUser: res.data.user, listing: res.data.listing, pivot })
      this.scrollToBottom()
    })
    .catch(err => console.log(err))
  }

  handleWaypointEnter = () => {
    const { pivot, conversationId } = this.state
    if(pivot !== null && conversationId !== '') {
      this.props.getMoreMessages({ conversationId, pivot })
      .then(res => {
        let pivot = null
        if(res.data.length >= 20) {
          pivot = res.data[0]
        }
        let messages = res.data.map(message => {
          if(message.author === this.props.user.info.id)
            return { sender: 'You', body: message.body }
          else
            return { sender: this.state.otherUser.firstName , body: message.body }
        })
        this.setState({ messages: [...messages, ...this.state.messages ], pivot})
      })
      .catch(err => {
        console.log(err)
      })
    }
  }

  handleWaypointLeave = e => {
    console.log('leaving top')
  }

  /**
   * Join the conversation channel. On new messages
   * check if the current user sent the new message.
   */
  componentDidMount = () => {
    const { conversationId } = this.state
    socket.emit('join-conversation', conversationId)
    socket.on('refresh-messages', message => {
      let parsedMessage = message
      if(message.sender === this.props.user.info.id)
        parsedMessage = { sender: 'You', body: message.body }
      this.setState({ 
        messages: [...this.state.messages, parsedMessage]
      })
      this.scrollToBottom()
    })
  }

  /**
   * When unmounting we want to get rid of the
   * listener in refresh-messages and leave the
   * current channel
   */
  componentWillUnmount = () => {
    socket.removeAllListeners();
    socket.emit("leave-conversation", this.state.conversationId);
  }

  componentDidUpdate() {
    console.log(this.state.stickyPoint)
  }

  /**
   * onChange function for message input
   */
  onChange = e => {
    this.setState({ [e.target.name]: e.target.value})
  }

  /**
   * Check for invalid strings, empty strings here.
   * Save the message body to the database first, then
   * we'll emit the message to the current channel
   */
  sendMessage = e => {
    e.preventDefault()
    const { body, conversationId } = this.state
    if (body !== '') {
      const data = {
        conversationId,
        body,
        author: this.props.user.info.id
      }
      
      this.props.sendMessage(data)
      .then(res => {
        socket.emit('new-message', {
          sender: this.props.user.info.id, 
          body,
          conversationId
        })
        this.setState({ body: ''})  
      })
    }
  }

scrollToBottom = () => {
  const node = ReactDOM.findDOMNode(this.messagesEnd)
  node.scrollIntoView({ behavior: 'smooth' })
}

  render() {
    if (this.state.redirect) {
      return <Redirect push to="/" />;
    }
    return (
      <div className='conversationContainer'>
      <br/>
        <span className="chatTop">
          <Link to='/profile/messages' className='chatTop-btn' onClick={this.props.toggleChat}><FontAwesome name='arrow-left'/></Link>
          <span className="headerName">conversation with {this.state.otherUser.firstName} {this.state.otherUser.lastName}</span>
          <span className='chatTop-btn' onClick={this.minChat}><FontAwesome name='window-minimize'/></span>
        </span>
      <br/>
      <div className='conversationListing'>
        <Link to={`/listing/${this.state.listing._id}`} className='conversationListingLink'>
          <img src={this.state.listing.photos[0].image} alt=''/>  
          <h4>{this.state.listing.name}</h4>
        </Link>
        <span>
          <h4><FontAwesome name='asterisk'/> Send Offer</h4>
        </span>
        <span>
          <h4><FontAwesome name='shopping-cart'/> Request to Buy for ${this.state.listing.price}</h4>
        </span>
      </div>
      <br/>
      <div className='chatContainer'>
          <div className='chatContent'>
              <ul className='chatMessages' onScroll={this.handleScroll}>

                <Waypoint 
                  onEnter={this.handleWaypointEnter} 
                  onLeave={this.handleWaypointLeave} />
                  {this.state.messages.map((message, key) => {
                      return (
                        <li
                          className={message.sender === 'You' ? 'messageRight' : 'messageLeft'}
                          key={key}>
                          {message.body}
                        </li>
                      )
                    })
                  }
                <div style={{ float:"left", clear: "both" }} ref={(e) => { this.messagesEnd = e }}/>
              </ul>
            <form className="chatInput" onSubmit={this.sendMessage}>
              <input
                type='text'
                onChange={this.onChange}
                value={this.state.body}
                placeholder='Message'
                name='body'/>
              <FontAwesome name='paper-plane' onClick={this.sendMessage} className='sendIcon'/>
            </form>
          </div>
        </div>
      </div>
    )
  }
}


export default connect(mapStateToProps, { getChat, getMoreMessages, sendMessage,})(Chat)