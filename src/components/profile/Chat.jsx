// Node Modules
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import FontAwesome from 'react-fontawesome'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

// User Functions
import { getChat, sendMessage } from '../../actions/message.js'
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
    conversationId: ''
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
      let messages = res.data.messages.map(message => {
        if(message.author === this.props.user.info.id)
          return { sender: 'You', body: message.body }
        else
          return { sender: res.data.user.firstName , body: message.body }
      })
      this.setState({ messages, otherUser: res.data.user, listing: res.data.listing })
      this.scrollToBottom()
    })
    .catch(err => console.log(err))
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
    socket.removeAllListeners()
    socket.emit('leave-conversation', this.state.conversationId)
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
  console.log('scrolling')
}

  render() {
    return (
      <div className='conversationContainer'>
      <br/>
      <Link to='/profile/messages' className='leaveChat' onClick={this.props.toggleChat}>
        <FontAwesome name='arrow-left' style={{color: 'white'}} />
      </Link>
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
            <div className='chatHeader'>
              <img src={this.state.otherUser.profile_picture} alt='profile'/>
              <h3>{this.state.otherUser.firstName} {this.state.otherUser.lastName}</h3>
            </div>
            <ul className='chatMessages'>
              {
                this.state.messages.map((message, key) => {
                  return (
                    <li
                      className={message.sender === 'You' ? 'messageRight' : 'messageLeft'}
                      key={key}>
                      {message.body}
                    </li>
                  )
                })
              }
              <div style={{ float:"left", clear: "both" }} ref={(e) => { this.messagesEnd = e }}>
              </div>
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

export default connect(mapStateToProps, { getChat, sendMessage })(Chat)
