// Node Modules
import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { RotatingPlane } from 'better-react-spinkit'

// utils
import { newConversation, getConversations } from '../../actions/message'
import mapStateToProps from '../../utils/redux.js'

// Styles
import './styles/Messages.scss'

class Messages extends Component {

  state = {
    conversations: [],
    currentConversation: null
  }

  componentWillMount = () => {
    this.setState({ isLoading: true })
    this.props.getConversations(this.props.user.info.id)
    .then(res => {
      this.setState({ conversations: res.data.conversations, isLoading: false })
    })
    .catch(err => {
      console.log(err)
    })
  }

  render() {
    return (
      <div>
        {this.state.isLoading
          ? <span className='messageLoading'><RotatingPlane color='#F29A70' size={50}/></span>
          : <div className="chatThreadContainer">
              <h3>Messages</h3>
              <hr/>
              <div className='chatThreadContent'>
                {this.state.conversations.map((conversation, key) => {
                  return (
                    <div key={key} className='chatThreadFlex'>
                      <Link 
                      to ={`/messages/${conversation.conversationId}`}  
                      className='chatThreadLink'>
                          <span className='chatThreadUser' >
                            <img 
                            src={conversation.profile_picture} 
                            alt=''/>
                            <span className='chatThreadUser-text'>
                              <h4>{conversation.firstName} {conversation.lastName}</h4>
                              <p>{conversation.previewMessage.body}</p>
                            </span>
                          </span>
                      </Link>

                      <Link
                        to={`/listing/${conversation.listing._id}`}
                        className='chatListingLink'>
                          <span className='chatThreadListing'>
                            <img src={conversation.listing.image} alt='listing' />
                            <p>{conversation.listing.name}</p>
                          </span>
                      </Link>
                    </div>
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

export default connect(mapStateToProps, { newConversation, getConversations })(Messages)