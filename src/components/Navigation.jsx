// Modules
import React, { Component } from 'react';
import { Link, withRouter }             from 'react-router-dom';
import { connect }          from 'react-redux'
import { logout }   from '../actions/login'

// Components
import SignupModal from './SignupModal.jsx'
import Login from './Login.jsx'
import NavMobile from './NavMobile.jsx'

//Styles
import './styles/Navigation.css'

class Navigation extends Component {

  state = {
    signup: false,
    login: false,
    category: false,
  }

  toggleSignup = () => {
    this.setState({ signup: !this.state.signup })
  }

  toggleLogin = () => {
    this.setState({ login: !this.state.login })
  }

  toggleCat = () => {
    this.setState({ category: !this.state.category})
  }

  closeModal = () => {
    this.setState({
      signup: false,
      login: false,
      category: false
    })
  }

  render() {
    const notLoggedIn = (
      <span>
        <button onClick={this.toggleSignup} className="navButton">Sign Up</button>
        <button onClick={this.toggleLogin} className="navButton left">Login</button>
      </span>
    )

    const loggedIn = (
      <span className="navActions">
        <Link to="/" onClick={this.props.logout} className="navButton">Logout</Link>
        <Link to="/sell" className="navButton">Sell</Link>
        <Link to={`/profile`} className="navButton">Profile</Link>
      </span>
    )

    return (
      <div>
        <div className="navPlaceholder"/>
        <div className="navOntop">
          <div className="navContainer">
            <div className="navContent">
              <Link to="/" id="navLogo" onClick={this.closeModal}>GEARHUB</Link>
              {this.props.user.isAuthenticated ? loggedIn : notLoggedIn}
              { this.state.signup && <SignupModal toggle={this.state.signup} close={this.closeModal}/> }
              { this.state.login && <Login toggle={this.state.login} close={this.closeModal}/> }
            </div>
          </div>
          <NavMobile
            catState={this.state.category}
            openModal={this.toggleCat}
            closeModal={this.closeModal}
          />
        </div>
      </div>
    )
  }
}

function mapStateToProps(state){
  return {
    user: state.user
  }
}

export default withRouter(connect(mapStateToProps, { logout })(Navigation))
