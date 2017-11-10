// Node Modules
import React, { Component } from "react";
import ReactDOM from "react-dom";
import FontAwesome from "react-fontawesome";
import { Link } from "react-router-dom";

// User Functions
import { getChat, sendMessage } from "../actions/message.js";
import { getOpen, closeChat } from "../actions/chat.js";
import socket from "../utils/socket.js";
// Styles
import "./styles/ChatBottom.scss";

class ChatBottomItem extends Component {
  state = {
    messages: [],
    body: "",
    otherUser: {
      firstName: "",
      lastName: "",
      profile_picture: ""
    },
    listing: {
      photos: [{ image: "" }]
    },
    conversationId: ""
  };

  componentWillMount = () => {
    this.props.getOpen();
    this.setState({ conversationId: this.props.conversationId });
    let conversationId = this.props.conversationId;
    const _id = this.props.user && this.props.user.id;
    this.props
      .getChat({ conversationId, _id })
      .then(res => {
        // Parse the messages to differentiate who sent the message
        let messages = res.data.messages.map(message => {
          if (message.author === this.props.user.id)
            return { sender: "You", body: message.body };
          else return { sender: res.data.user.firstName, body: message.body };
        });
        this.setState({
          messages,
          otherUser: res.data.user,
          listing: res.data.listing
        });
        this.scrollToBottom();
      })
      .catch(err => console.log(err));
  };

  componentDidMount = () => {
    const { conversationId } = this.state;
    let getOpenChats = this.props.getOpen()
    let openChats = getOpenChats.func
    if(openChats[conversationId] === undefined) {
      socket.emit("join-conversation", conversationId);
    }

    socket.on("refresh-messages", message => {
      console.log("refresh");
      let parsedMessage = message;
      if (message.sender === this.props.user.id)
        parsedMessage = { sender: "You", body: message.body };
      this.setState({
        messages: [...this.state.messages, parsedMessage]
      });
      this.scrollToBottom();
    });
    console.log(socket);
  };

  /**
   * When unmounting we want to get rid of the
   * listener in refresh-messages and leave the
   * current channel
   */
  componentWillUnmount = () => {
    let getOpenChats = this.props.getOpen()
    let openChats = getOpenChats.func
    if(openChats[this.state.conversationId] === undefined) {
      socket.removeAllListeners();
      socket.emit("leave-conversation", this.state.conversationId);
    }
  };

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  scrollToBottom = () => {
    const node = ReactDOM.findDOMNode(
      this["messagesEnd" + this.state.conversationId]
    );
    node.scrollIntoView({ behavior: "smooth" });
  };

  closeChat = () => {
    this.props.closeChat(this.state.conversationId);
    let openChats = this.props.getOpen();
  };

  sendMessage = e => {
    e.preventDefault();
    const { body, conversationId } = this.state;
    if (body !== "") {
      const data = {
        conversationId,
        body,
        author: this.props.user.id
      };
      this.props.sendMessage(data).then(res => {
        socket.emit("new-message", {
          sender: this.props.user.id,
          body,
          conversationId
        });
        this.setState({ body: "" });
      });
    }
  };

  render() {
    return (
      <div className="chatItem">
        <FontAwesome
          name="times"
          onClick={this.closeChat}
          className="closeIcon"
        />
        <div className="chatBottomContainer">
          <div className="chatBottomContent">
            <Link to={`/messages/${this.state.conversationId}`}>
              <div className="chatBottomInfo">
                {this.state.otherUser.firstName} {this.state.otherUser.lastName}{" "}
                - {this.state.listing.name}
              </div>
            </Link>
            <ul className="chatBottomMessages">
              {this.state.messages.map((message, key) => {
                return (
                  <li
                    className={
                      message.sender === "You" ? "messageRight" : "messageLeft"
                    }
                    key={key}
                  >
                    <span>{message.body}</span>
                  </li>
                );
              })}
              <div
                style={{ float: "left", clear: "both" }}
                ref={e => {
                  this["messagesEnd" + this.state.conversationId] = e;
                }}
              />
            </ul>
            <form className="chatBottomInput" onSubmit={this.sendMessage}>
              <input
                autocomplete="off"
                type="text"
                onChange={this.onChange}
                value={this.state.body}
                placeholder="Message"
                name="body"
              />
              <FontAwesome
                name="paper-plane"
                onClick={this.sendMessage}
                className="sendIcon"
              />
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default ChatBottomItem;