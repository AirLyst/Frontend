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
                    src={this.props.src != undefined ? this.props.src.preview || this.props.src : ''}
                    onClick={this.openLarge} 
                    className={this.state.expanded ? 'expanded-polaroid polaroid' : 'polaroid-regular polaroid'}
                    />
                        { this.props.onChangeDesc != false ?
                        <textarea
                            type="text"
                            className="polaroidDescription polaroidBottom"
                            onChange={(e) => this.props.onChangeDesc(e.target.value, this.props.indx)}
                            value={this.props.description}
                            placeholder='Describe this picture'
                        /> : 
                        <textarea
                            readOnly
                            type="text"
                            className="polaroidDescription polaroidBottom"
                            value={this.props.description}
                            placeholder=''
                        /> 
                        }
                </span>
            </div>
        )
    }
}

export default Polaroid