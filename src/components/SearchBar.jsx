import React, { Component } from 'react'
import PropTypes from 'prop-types'

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
        <form className='searchBar' onSubmit={this.onSubmit}>
          <input
            type='text'
            name='query'
            placeholder='Search for designers, type, colors...'
            onChange={this.onChange}
            value={this.state.searchParam}/>
        </form>
      </div>
    )
  }
}

SearchBar.contextTypes = {
  router: PropTypes.object.isRequired
}

export default SearchBar