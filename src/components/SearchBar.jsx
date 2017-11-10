import React, { Component } from 'react'

import './styles/SearchBar.scss'

export default class SearchBar extends Component {
  state = {
    searchParam: ''
  }

  onChange = e => { this.setState({ [e.target.name]: e.target.value })}

  onSubmit = e => {
    e.preventDefault()
  }
  render() {
    return (
      <div className='searchBarContainer'>
        <form className='searchBar' onSubmit={this.onSubmit}>
          <input
            type='text'
            name='searchParam'
            placeholder='Search for designers, type, colors...'
            onChange={this.onChange}
            value={this.state.searchParam}/>
        </form>
      </div>
    )
  }
}
