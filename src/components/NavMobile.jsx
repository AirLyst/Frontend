import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'

// Styles
// check Home.css


class NavCategory extends Component{

  state = {
    arrowStyle: "modalArrow down",
    mobileStyle: "mobileLinkContainer",
  }

  catOpen = () => {
    this.setState({
      arrowStyle: "modalArrow up",
      mobileStyle: "mobileLinkContainer enter" })
      this.props.openModal()
  }

  catClose = () => {
    this.setState({
      arrowStyle: "modalArrow down",
      mobileStyle: "mobileLinkContainer leave" })
    setTimeout(() => {
      this.props.closeModal()
    }, 300)
  }

  render() {
    const categories = [
      "New",
      "Tops",
      "Bottoms",
      "Kicks",
      "Accessories",
      "Headwear"
    ]
    return (
      <div>
        <div className="catMobile">
          {this.props.catState
            ? <i className={this.state.arrowStyle} onClick={this.catClose}></i>
            : <i className={this.state.arrowStyle} onClick={this.catOpen}></i>
          }
        </div>
        {
          this.props.catState && (
            <div className={this.state.mobileStyle}>
            <br />
              {categories.map((category, key) => {
                return (
                  <NavLink
                    key={key}
                    onClick={this.catClose}
                    to={`/home/${category}`}
                    className="mobileLinks"
                    activeClassName="mobileLinks active">
                    {category}
                  </NavLink>
                )
              }
              )}
            </div>
          )
        }
        </div>


    )
  }
}

export default NavCategory
