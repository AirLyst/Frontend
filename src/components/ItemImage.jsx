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
        {this.state.large && <Polaroid indx={this.props.indx} description={this.props.description} src={this.props.src} onChangeDesc={this.props.noEdit ? false : this.props.onChangeDesc} />}
        {this.state.large && <span className="overshadow" onClick={this.expand} />}
        <div className='imgPreview' onClick={this.props.noEdit && this.expand}>
          {this.props.noEdit ? null : <span className="delImg" onClick={() => this.props.onDel(this.props.indx)} src={this.props.src}>&times;</span>}
          <img 
            src={this.props.src !== undefined ? this.props.src.preview || this.props.src : ''}
            onClick={this.expand}
            alt='item'
            className='imgContent' 
          />
        </div>
      </div>
    )
  }
}


export default ImageCard