import React, { Component } from 'react';
import Modal from 'react-modal'

import './styles/TestComponent.css'

class TestComponent extends Component {
  state = {
    showModal: false
  }

  handleShowModal = () => {
    this.setState({ showModal: true })
  }

  handleHideModal = () => {
    this.setState({ showModal: false })
  }

  render() {
    return (
      <div style={{textAlign: "center"}}>
        
        <button onClick={this.handleShowModal}>Test</button>
        <Modal
          isOpen={this.state.showModal}
          contentLabel="Label"
          onRequestClose={this.handleHideModal}
          className="Modal"
          overlayClassName="Overlay"
        >
          <button onClick={this.handleHideModal}>Close Modal</button>
        </Modal>
      </div>
    );
  }
}

export default TestComponent