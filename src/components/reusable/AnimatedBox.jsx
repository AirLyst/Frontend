import React, { Component } from 'react'
import FontAwesome from 'react-fontawesome'

import './styles/AnimatedBox.css'

class AnimationBox extends Component {
  constructor(props){
    super(props)

    this.onSubmit = this.onSubmit.bind(this)
    this.onChange = this.onChange.bind(this)
    this.state = {
      searchFor: "",
      placeholder: "Search"
    }
  }

  onSubmit(e) {
    e.preventDefault()
    if(!this.state.searchFor)
      this.setState({ placeholder: "Search brands, designers, etc."})
    console.log(this.state.searchFor)
  }

  onChange(e) {
    console.log(e.target.value)
    this.setState({ searchFor: e.target.value })
  }
  render(){
    return (
      <div>        
        <div id="box">
          <div id="content">
            <h3>Look for that missing piece!</h3>
            <form onSubmit={this.onSubmit}>
              <input type="text" placeholder={this.state.placeholder} onChange={this.onChange}/>
              <FontAwesome name="search" id="fa-search" size="2x" className="search" onClick={this.onSubmit}/>
            </form>
          </div>
        </div>
      </div>
    )
  }
}

export default AnimationBox