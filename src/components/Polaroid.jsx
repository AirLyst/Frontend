import React, { Component } from 'react';
import './styles/ItemImage.scss'

class Polaroid extends Component {
    state = {
        description: '',
        expanded: false
    }
    onChange = e => {
        this.setState({ description: e.target.value })
    }
    openLarge = () => {
        this.setState({ expanded: !this.state.expanded })
    }
    render() {
        return (
            <div className='openPreview'>
                <span className='polaroidWrap'>
                    <img 
                    alt='item'
                    title={this.state.expanded ? 'click to shrink' : 'click to see whole image'}
                    src={this.props.src.preview} 
                    onClick={this.openLarge} 
                    className={this.state.expanded ? 'expanded-polaroid polaroid' : 'polaroid-regular polaroid'}
                    />
                    <span className="polaroidBottom">
                        <textarea
                        type="text"
                        className="polaroidDescription"
                        onChange={(e) => this.props.onChangeDesc(e.target.value, this.props.indx)}
                        value={this.props.src.description}
                        placeholder='Describe this picture'
                        />
                    </span>
                </span>
            </div>
        )
    }
}

export default Polaroid