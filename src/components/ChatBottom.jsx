// Node Modules
import React, { Component } from "react";
import { connect } from "react-redux";
import ChatBottomItem from "./ChatBottomItem.jsx";
import ChatBoxItem from "./ChatBoxItem.jsx";
// User Functions
import { getChat, sendMessage } from "../actions/message.js";
import { getConversations } from "../actions/message";
import { getOpen, closeChat } from "../actions/chat.js";
import mapStateToProps from "../utils/redux.js";
// Styles
import "./styles/ChatBottom.scss";

class ChatBottom extends Component {
  state = {
    conversations: {},
    messages: {},
    show: false,
    openChat: null,
    num: null,
    loading: false
  };

  componentWillMount = () => {
    this.getAll();
  };

  getAll = () => {
    this.state.conversations != {} && this.setState({ loading: true });
    this.props.user.info &&
      this.props
        .getConversations(this.props.user.info.id)
        .then(res => {
          console.log(res.data.conversations);
          this.setState({
            conversations: res.data.conversations,
            messages: res.data.messages,
            loading: false
          });
        })
        .catch(err => {
          console.log(err);
        });
  };

  toggle = () => {
    !this.state.show && this.getAll();
    this.setState({ show: !this.state.show });
  };

  populateChat = (id, num) => {
    this.getAll();
    this.setState({
      openChat: id,
      num
    });
  };

  render() {
    return (
      <div className={this.state.show ? "chatBottom" : "chatBottom-closed"}>
        <div
          className={
            this.state.show
              ? "chatBottom-cont"
              : "chatBottom-closed-banner-fixed"
          }
        >
          <div onClick={this.toggle} className="chatBottom-banner">
            {this.state.openChat === null ? (
              <span>Chat </span>
            ) : (
              <span>
                {this.state.show ? (
                  `${this.state.conversations[this.state.num].firstName} - ${
                    this.state.conversations[this.state.num].listing.name
                  }`
                ) : (
                  <span>Chat</span>
                )}
              </span>
            )}
          </div>
          {this.state.openChat != null &&
            this.state.show && (
              <div
                className="chatBottom-banner-prev"
                onClick={() => {
                  this.populateChat(null, null);
                }}
              />
            )}
        </div>
        {this.state.loading && this.state.show ? (
          <div className="chatBottom-loading">loading...</div>
        ) : (
          this.state.show &&
          this.state.openChat !== null && (
            <ChatBottomItem
              getOpen={this.props.getOpen}
              closeChat={this.props.closeChat}
              sendMessage={this.props.sendMessage}
              getChat={this.props.getChat}
              user={this.props.user.info}
              conversationId={this.state.openChat}
              conversation={this.state.conversations[this.state.num]}
            />
          )
        )}
        {Object.keys(this.state.conversations).map((x, k) => {
          return (
            this.state.show &&
            this.state.openChat === null && (
              <ChatBoxItem
                firstName={this.state.conversations[x].firstName}
                key={k}
                id={this.state.conversations[x].conversationId}
                getChat={this.props.getChat}
                populateChat={this.populateChat}
                conversation={this.state.conversations[k].listing.name}
                num={k}
                preview={this.state.conversations[k].previewMessage}
              />
            )
          );
        })}
      </div>
    );
  }
}

export default connect(mapStateToProps, {
  getChat,
  sendMessage,
  getConversations,
  getOpen,
  closeChat
})(ChatBottom);
