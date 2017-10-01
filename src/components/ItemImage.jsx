import React, { Component } from 'react';
import Polaroid from './Polaroid'
import './styles/ItemImage.scss'


class ImageCard extends Component {
  state = {
    large: false,
  }
  expand = () => {
    this.setState({ large: !this.state.large })
  }
  render() {
    return (
      <div className='imgContainer'>
        {this.state.large ? <Polaroid indx={this.props.indx} src={this.props.src} onChangeDesc={this.props.onChangeDesc} /> : null}
        {this.state.large ? <span className="overshadow" onClick={this.expand} /> : null}
        <div className='imgPreview'>
          <span className="delImg" onClick={() => this.props.onDel(this.props.indx)} src={this.props.src}>Delete</span>
          <span className="expandImg" onClick={this.expand}>Open</span>
          <img src={this.props.src.preview} alt='item' className="imgContent" />
        </div>
      </div>
    )
  }
}


export default ImageCard