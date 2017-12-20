// Node Modules
import React, { Component } from "react"
import { connect } from "react-redux"
import ChatBottomItem from "./ChatBottomItem.jsx"

// User Functions
import { getChat, sendMessage } from "../actions/message.js"
import { getOpen, closeChat } from "../actions/chat.js"
import mapStateToProps from "../utils/redux.js"
// Styles
import "./styles/ChatBottom.scss"

class ChatBottom extends Component {
  state = {
    conversationIds: {}
  }

  componentWillMount = () => {
    if (localStorage["openChats"] !== undefined)
      this.setState({ conversationIds: JSON.parse(localStorage["openChats"]) })
    else this.setState({ conversationIds: {} })
  }

  componentWillReceiveProps = () => {
    console.log("ok")
    if (localStorage["openChats"] !== undefined)
      this.setState({ conversationIds: JSON.parse(localStorage["openChats"]) })
    else this.setState({ conversationIds: {} })
  }

  render() {
    return (
      <div className="chatBottom">
        {Object.keys(this.state.conversationIds).map((x, k) => {
          console.log(x)
          return (
            <ChatBottomItem
              key={k}
              getOpen={this.props.getOpen}
              closeChat={this.props.closeChat}
              sendMessage={this.props.sendMessage}
              getChat={this.props.getChat}
              user={this.props.user.info}
              conversationId={x}
            />
          )
        })}
      </div>
    )
  }
}

export default connect(mapStateToProps, {
  getChat,
  sendMessage,
  getOpen,
  closeChat
})(ChatBottom)