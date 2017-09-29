import React          from 'react'
import { withRouter } from 'react-router-dom';
import PropTypes      from 'prop-types'
import FacebookLogin  from 'react-facebook-login'
import GoogleLogin    from 'react-google-login'
import FontAwesome    from 'react-fontawesome'
import Validator      from 'validator'
//Redux
import { connect } from 'react-redux'
import { signup, signupFacebook, signupGoogle } from '../actions/signup'

// Styles
import './styles/modal.css'

class SignupModal extends React.Component {

  state = {
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    errors: {},
    modalContainer: 'modalContainer enter',
    modalContent: 'modalContent enter'
  }

  validateForm(data) {
    let errors = {}
    let isValid = true

    if(Validator.isEmpty(data.username))
      errors.username = 'This field is required'
    if(Validator.isEmpty(data.password))
      errors.password = 'This field is required'
    if(Validator.isEmpty(data.confirmPassword))
      errors.password = 'This field is required'
    if(data.password !== data.confirmPassword) {
      isValid = false
      errors.confirmPassword = "Passwords don't match"
    }
    if(errors.password || errors.username)
      isValid = false

    return {
      errors,
      isValid
    }
  }

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value })
  }

  closeModal = () => {
    this.setState({ modalContent: 'modalContent leave', modalContainer: 'modalContainer leave' })
    setTimeout(() => {
      this.props.close()
    }, 500)
  }

  onSubmit = (e) => {
    e.preventDefault()
    const { isValid, errors } = this.validateForm(this.state)
    if(isValid) {
      this.props.signup(this.state)
      .then(res => {
        this.closeModal()
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
      this.closeModal()
      this.context.router.history.push('/')
    })
  }

  googleSignup = (res) => {
    const { id_token } = res.tokenObj
    const { email } = res.profileObj
    const token = { id_token, email }
    this.props.signupGoogle(token)
    .then(res => {
      this.closeModal()
      this.context.router.history.push('/')
    })
  }

  googleSignupFail(err) {
    console.log(err)
  }

  render() {
    if(!this.props.close){
      return null;
    }
    return (
      <div className={this.state.modalContainer}>
        <form onSubmit={this.onSubmit} className={this.state.modalContent}>
        <div className="modalForm">
            {this.props.children}
            <span onClick={this.closeModal} id="modalClose">&times;</span>
            <h1>Sign Up</h1>
            <input type='text' name='firstName' placeholder="First Name" onChange={this.onChange} required/>
            <input type='text' name='lastName' placeholder="Last Name"onChange={this.onChange} required/>
            <input type='email' name='email' placeholder="E-Mail" onChange={this.onChange} required/>
            <input type='text' name='username' placeholder="Username" onChange={this.onChange} required/>
            <div>{this.state.errors.username && <span className="modalError">{this.state.errors.username}</span>}</div>
            <input type='password' name='password' placeholder="Password" onChange={this.onChange} required/>
            <div>{this.state.errors.password && <span className="modalError">{this.state.errors.password}</span>}</div>
            <input type='password' name='confirmPassword' placeholder="Confirm Password" onChange={this.onChange} required/>
            <div>{this.state.errors.confirmPassword && <span className="modalError">{this.state.errors.confirmPassword}</span>}</div>
            <button type='submit' onClick={this.onSubmit} id="modalSubmit">Signup</button>

            <hr/>
            <FacebookLogin
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
            </GoogleLogin>
          </div>
        </form>
      </div>
    )
  }
}

SignupModal.contextTypes = {
  router: PropTypes.object.isRequired
}

export default withRouter(connect(null, { signup, signupFacebook, signupGoogle })(SignupModal))
