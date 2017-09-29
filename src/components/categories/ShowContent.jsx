import React, { Component } from 'react';
import FontAwesome from 'react-fontawesome'

import Filter from './Filter.jsx'

import './styles/ShowContent.css'

class ShowContent extends Component {

  state = {
    showFilter: false,
    filterAnimation: "fade 1s forwards",
    contentAnimation: "fade 1s forwards"
  }

  showFilter = () => {
    this.setState({
      filterAnimation: "filterIn-up 0.25s forwards",
      contentAnimation: "filterOut-down 0.25s forwards"
    })
    setTimeout(() => this.setState({ showFilter: true }) ,250)
  }

  hideFilter = () => {
    this.setState({
      filterAnimation: "filterOut-up 0.25s forwards",
      contentAnimation: "filterIn-down 0.25s forwards"
    })
    setTimeout(() => this.setState({ showFilter: false }) ,250)
  }
  
  render() {
    return (
      <div>
      {
        this.state.showFilter 
        ? <Filter animation={this.state.filterAnimation} hideFilter={this.hideFilter} />
        : 
          (
          <div className="showContentContainer" style={{animation: this.state.contentAnimation}}>
            <div className="page">
              <FontAwesome 
                name="chevron-left" 
                className="pageArrow previous"
                id="pagePrevious"
                onClick={this.showFilter}
              />
            </div>

            <div className="showContent" >
              <h1>{this.props.category}</h1>
              <hr/>
              <FontAwesome 
                name="gear" 
                id="filterArrow"
                onClick={this.showFilter}
              />
            </div>

            <div className="page">
              <FontAwesome 
                name="chevron-right"
                id="pageForward"
                className="pageArrow forward"
                onClick={this.showFilter}
              />
            </div>
          </div>
          )
      }
      </div>
    );
  }
}


export default ShowContent