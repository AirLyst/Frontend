// Node Modules
import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

// Components
import Chat from './Chat.jsx'

// utils
// import socket from '../../utils/socket.js'
import { newConversation, getConversations } from '../../actions/message'

// Styles
import './styles/Messages.scss'

class Messages extends Component {

  state = {
    conversations: [],
    showChat: false,
    currentConversation: null
  }

  componentDidMount = () => {

  }

  componentWillMount = () => {
    this.props.getConversations(this.props.user.info.id)
    .then(res => {
      this.setState({ conversations: res.data.conversations })
    })
  }
  
  
  newChat = e => {
    e.preventDefault()
    const recipient = '59b800c25b0540359072c78c'
    const { firstName, lastName } = this.props.user.info
    const conversation = {
      user: this.props.user.info.id,
      recipient,
      message: '2 New Test Message to Alex Cushing 2',
      displayName: `${firstName} ${lastName}`
    }
    this.props.newConversation(conversation)
    .then(res => {
      console.log(res)
    })
    .catch(err => {
      console.log(err)
    })
  }

  toggleChat = conversationIndex => {
    const currentConversation = this.state.conversations[conversationIndex]
    this.setState({ showChat: !this.state.showChat, currentConversation })
  }

  render() {
    return (
      <div>
      <div onClick={this.newChat}> Send Test </div>
      {this.state.showChat 
        ? <Chat 
          conversation={this.state.currentConversation} 
          userId={this.props.user.info.id}
          toggleChat={this.toggleChat}/>
        :
        <div className="card">
            <h3>Messages</h3>
            <hr/>
            <div className='chatsContainer'>
              {this.state.conversations.map((conversation, key) => {
                return (
                  <Link 
                  to ={`/messages/${conversation.conversationId}`} 
                  key={key} 
                  className='chatGrid'>
                      <img 
                      src={conversation.profile_picture} 
                      className='chatGrid-item-one'
                      alt=''/>
                      <span className='chatGrid-item-two'>
                        <h4>{conversation.firstName} {conversation.lastName}</h4>
                        <p>{conversation.previewMessage.body}</p>
                      </span>
                  </Link>
                )
              })}
            </div>
        </div>
      }
        <br/>
        <br/>
      </div>
    );
  }
}

function mapStateToProps(state){
  return {
    user: state.user
  }
}

export default connect(mapStateToProps, { newConversation, getConversations })(Messages)