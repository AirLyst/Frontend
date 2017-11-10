// Node Modules
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import FontAwesome from 'react-fontawesome'
import { connect } from 'react-redux'
import { Link, Redirect } from 'react-router-dom'

// User Functions
import { getOpen, closeChat, addChat } from '../../actions/chat.js'
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
    conversationId: '',
    isMin: false,
    redirect: false,
    bottomChats: {}
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
    let bottomChats = this.props.getOpen()
    this.setState({ conversationId, isMin: false, bottomChats })
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
    this.removeFromLocalStorage()
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

  minChat = () => {
    this.props.addChat(this.state.conversationId)
    let bottomChats = this.props.getOpen()
    console.log(bottomChats)
    this.setState({ isMin: true, redirect: true, bottomChats })
  }

  removeFromLocalStorage = () => {
    this.props.closeChat(this.state.conversationId)
    let bottomChats = this.props.getOpen()
    this.setState({ bottomChats })
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


export default connect(mapStateToProps, { getChat, sendMessage, getOpen, closeChat, addChat })(Chat)