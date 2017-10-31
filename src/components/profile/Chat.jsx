import React, { Component } from 'react'
import FontAwesome from 'react-fontawesome'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import { getChat, sendMessage } from '../../actions/message.js'
import socket from '../../utils/socket.js'

import './styles/Chat.scss'

class Chat extends Component {
  state = {
    messages: [],
    message: '',
    otherUser: {
      firstName: '',
      lastName: '',
      profile_picture: ''
    },
    conversationId: ''
  }

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
      this.setState({ messages, otherUser: res.data.user })
    })
    .catch(err => console.log(err))
  }
  
  componentDidMount = () => {
    const { messages, conversationId } = this.state
    socket.emit('join-conversation', conversationId)
    socket.on('refresh-messages', message => {
      let parsedMessage = message
      if(message.sender === this.props.user.info.id)
        parsedMessage = { sender: 'You', body: message.body }
      this.setState({ 
        messages: [...this.state.messages, parsedMessage]
      })
    })
  }

  componentWillUnmount = () => {
    socket.removeAllListeners()
    socket.emit('leave-conversation', this.state.conversationId)
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value})
  }

  sendMessage = e => {
    e.preventDefault()
    const { message,conversationId } = this.state
    if (message !== '') {
      const data = {
        conversationId,
        message,
        author: this.props.user.info.id
      }
      
      this.props.sendMessage(data)
      .then(res => {
        socket.emit('new-message', {
          sender: this.props.user.info.id, 
          message,
          conversationId
        })
        this.setState({ message: ''})  
      })
    }
  }
  render() {
    return (
      <div className='chatContainer'>
        <Link to='/profile/messages' className='leaveChat' onClick={this.props.toggleChat}>
          <FontAwesome name='arrow-left' style={{color: '#F29B70'}} />
          <p> BACK</p>
        </Link>
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
                    className={message.sender === 'You' ? 'right' : 'left'}
                    key={key}>
                    {message.body}
                  </li>
                )
              })
            }
          </ul>
          <form className="chatInput" onSubmit={this.sendMessage}>
            <input
              onChange={this.onChange}
              value={this.state.message}
              name='message'/>
            <FontAwesome name='paper-plane' onClick={this.sendMessage}/>
          </form>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state){
  return {
    user: state.user
  }
}

export default connect(mapStateToProps, { getChat, sendMessage })(Chat)
