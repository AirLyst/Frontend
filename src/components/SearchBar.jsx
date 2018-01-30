import React, { Component } from 'react'
import PropTypes from 'prop-types'
import FontAwesome from 'react-fontawesome'

import './styles/SearchBar.scss'

class SearchBar extends Component {
  state = {
    query: ''
  }

  onChange = e => this.setState({ [e.target.name]: e.target.value })

  onSubmit = e => {
    e.preventDefault()
    const { query } = this.state
    if (query !== '')
      this.context.router.history.push(`/search/${query}`)
  }
  render() {
    return (
      <div className='searchBarContainer'>
        <h1>Search</h1>
        <form className='searchBar' onSubmit={this.onSubmit}>
          <input
            type='text'
            name='query'
            placeholder='Look for Nike, Hoodies, etc.'
            onChange={this.onChange}
            value={this.state.searchParam}/>
          <button
            type='subit'
            onSubmit={this.onSubmit}>
            <FontAwesome name='search' />
          </button>
        </form>
      </div>
    )
  }
}

SearchBar.contextTypes = {
  router: PropTypes.object.isRequired
}

export default SearchBar