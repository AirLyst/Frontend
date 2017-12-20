import React, { Component } from 'react'
import { withRouter } from 'react-router-dom';
import PropTypes      from 'prop-types'
import FacebookLogin  from 'react-facebook-login'
import GoogleLogin    from 'react-google-login'
import FontAwesome    from 'react-fontawesome'
import Validator      from 'validator'

// Styles
import './styles/Signup.scss'

// Redux
import { connect } from 'react-redux'
import { signup, signupFacebook, signupGoogle } from '../actions/signup'

class Signup extends Component {j
  state = {
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    errors: {},
  }

  validateForm(data) {
    let errors = {}
    let isValid = true

    if(Validator.isEmpty(data.username))
      errors.username = 'A username is required'
    if(Validator.isEmpty(data.password))
      errors.password = 'Password required to login'
    if(Validator.isEmpty(data.confirmPassword))
      errors.password = 'Please confirm your password'
    if(data.password.length < 6 )
      errors.password = 'Password size must be greater than 6.'
    if(data.password !== data.confirmPassword) {
      isValid = false
      errors.confirmPassword = "Passwords do not match."
    }
    if(errors.password || errors.username)
      isValid = false

    return {
      errors,
      isValid
    }
  }

  clearErrors = () => {
    this.setState({ errors: {} })
  }

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value })
  }

  onSubmit = (e) => {
    e.preventDefault()
    const { isValid, errors } = this.validateForm(this.state)
    if(isValid) {
      this.props.signup(this.state)
      .then(res => {
        console.log(res)
        this.context.router.history.push('/')
      })
      .catch(err => {
        console.log(err)
      })
    } else {
      this.setState({ errors })
    }
  }

  facebookSignup = (res) => {
    const { accessToken, email } = res
    const token = { accessToken, email }
    this.props.signupFacebook(token)
    .then(res => {
      this.context.router.history.push('/')
    })
  }

  googleSignup = (res) => {
    const { id_token } = res.tokenObj
    const { email } = res.profileObj
    const token = { id_token, email }
    this.props.signupGoogle(token)
    .then(res => {
      this.context.router.history.push('/')
    })
  }

  googleSignupFail(err) {
    console.log(err) // this function is required by the google component
  }

  render() {
    return (
      <div className='signup-outer'>
        <h1>Sign Up</h1>
        <div className="signupContainer">
          <form onSubmit={this.onSubmit} className="signupForm">
            <span className='inputs'><span className='left-item'><label>First Name</label>
            <input 
              type='text' 
              name='firstName'
              onChange={this.onChange}
              onClick={this.clearErrors}
              required
            /></span>
            <span className='right-item'><label>Last Name</label>
            <input 
              type='text' 
              name='lastName' 
          
              onChange={this.onChange}
              onClick={this.clearErrors} 
              required
            /></span></span>
          <label>E-Mail</label>
          <input 
            type='email' 
            name='email' 
            onChange={this.onChange}
            onClick={this.clearErrors} 
            required
          />
          <label>Username</label>
          <input 
            type='text' 
            name='username' 
            onChange={this.onChange}
            onClick={this.clearErrors} 
            required
          />
          <span>
            {
              this.state.errors.username && 
                <span className="modalError">{this.state.errors.username}</span>
            }
          </span>
          <label>Password</label>
          <input 
            type='password' 
            name='password' 
            onChange={this.onChange}
            onClick={this.clearErrors} 
            required
          />
          <span>
            {
              this.state.errors.password &&
                <span className="modalError">{this.state.errors.password}</span>
            }
          </span>
          <label>Confirm Password</label>
          <input 
            type='password' 
            name='confirmPassword' 
            onChange={this.onChange}
            onClick={this.clearErrors} 
            required
          />
          <span>
            {
              this.state.errors.confirmPassword && 
                <span className="modalError">{this.state.errors.confirmPassword}</span>
            }
          </span>
              <button type='submit' onClick={this.onSubmit}>Sign Up</button>
          </form>
        </div>
          <span className='outsideSignup'><FacebookLogin
            appId="1149120715232337"
            callback={this.facebookSignup}
            fields="name,email"
            icon="fa-facebook-f fa-lg"
            textButton="&emsp;Signup with Facebook"
            cssClass="mediaLogin facebook"
          />
          <br/>
          <GoogleLogin
            clientId="806344560011-hrjb8lgp4ugu7kcqaspdmkjgkdjv2gp2.apps.googleusercontent.com"
            buttonText="Signup with Google"
            onSuccess={this.googleSignup}
            onFailure={this.googleSignupFail}
            className="mediaLogin google">
            <FontAwesome
              name="google lg"
              id="googleLogo"
              size="lg"/>
              <span>&emsp;Signup with Google</span>
          </GoogleLogin></span>
      </div>
    );
  }
}

Signup.contextTypes = {
  router: PropTypes.object.isRequired
}

export default withRouter(connect(null, { signup, signupFacebook, signupGoogle })(Signup))
