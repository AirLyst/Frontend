import React, { Component } from 'react';
import PropTypes      from 'prop-types'
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux'
import Select, { Creatable } from 'react-select';
import FontAwesome from 'react-fontawesome'
import Dropzone from 'react-dropzone'
import ImageCard from './ItemImage'
import Validator from 'validator'
import Scroll from 'react-scroll'

// Components
import Loading from './Loading.jsx'
import ErrorMessage from './ErrorMessage.jsx'

// Actions
import { sell } from '../actions/sell'

// CSS, react-select CSS
import 'react-select/dist/react-select.css';
import './styles/Sell.css'
import './styles/Dropzone.scss'

// Sizing Data
import { sizing, conditionOptions, categoryOptions } from './data/Sizing'

class Sell extends Component {

  state = {
    category: "tops",
    size: "s",
    condition: "new",
    title: "",
    price: "",
    brand: "",
    description: "",
    photoDescriptions: [],
    currentCat: [...sizing.oneSize, ...sizing.tops],
    photos: [],
    maxed: false,
    isLoading: false,
    errors: {}
  }

  componentDidUpdate() {
    localStorage.setItem('cache-sell', JSON.stringify({
      ...this.state,
      // Don't cache these:
      photos: [],
      errors: {},
      isLoading: false,
      maxed: false
    }))
  }

  componentWillMount() {
    if (localStorage['cache-sell'])
      this.setState(JSON.parse(localStorage['cache-sell']))
  }

  onSubmit = e => {
    e.preventDefault()
    const { isValid, errors } = this.validateForm(this.state)
    if(isValid){
      this.setState({ isLoading: true })
      const sellData = {
        category: this.state.category,
        size: this.state.size,
        condition: this.state.condition,
        name: this.state.title,
        price: this.state.price, 
        brand: this.state.brand, 
        description: this.state.description,
        photoDescriptions: this.state.photoDescriptions,
        photos: this.state.photos,
        userId: this.props.user.info.id
      }

      this.props.sell(sellData)
      .then(data => {
        localStorage.removeItem('cache-sell')
        this.context.router.history.push('/')
      })
      .catch(err => {
        const { errors } = this.state 
        errors.server = err.message
        this.setState({ 
          isLoading: false,
          errors
        })
      })
    } else {
      Scroll.animateScroll.scrollToTop()
      this.setState({ errors: errors })
    }
  }

  validateForm(data) {
    let errors = {}
    let isValid = true
    if(!data.size)
      errors.size = 'This field is required'
    if(!data.category)
      errors.category = 'Category field is required'
    if(!data.condition)
      errors.condition = 'Condition is required'
    if(Validator.isEmpty(data.title))
      errors.title = 'Title is required'
    if(Validator.isEmpty(data.price))
      errors.price = 'Price field is required'
    if(Validator.isEmpty(data.brand))
      errors.brand = 'Brand field is required'
    if(Validator.isEmpty(data.description))
      errors.description = 'A description is required'
    if(data.photos.length < 1)
      errors.photos = 'At least one photo is required!'
    if(errors.category || errors.title || errors.category || errors.size || errors.title || errors.photos || errors.price || errors.description || errors.brand)
      isValid = false
    return {
      errors,
      isValid
    }
  }
  onChange = e => {
    this.setState({ [e.target.name]: e.target.value, errors: {} })
  }

  onChangeDesc = (value, index) => {
    let { photoDescriptions } = this.state
    photoDescriptions[index] = value
    this.setState({
      photoDescriptions
    })
  }


  categoryChange = val => {
    if (!val)
      this.setState({ category: null, currentCat: null })
    else
      this.setState({ category: val.value, currentCat: [...sizing.oneSize, ...sizing[val.value]] })
  }

  sizeChange = val => {
    if (!val)
      this.setState({ size: null })
    else
      this.setState({ size: val.value })
  }

  condoChange = val => {
    if (!val)
      this.setState({ condition: null })
    else
      this.setState({ condition: val.value })
  }

  onDrop = (acceptedFiles, rejectedFiles) => {
    const { errors } = this.state 
    if(errors.photos) {
      errors.photos = null
      this.setState({ errors })
    }
    let photos = [...this.state.photos, ...acceptedFiles]
    photos = photos.filter((curr, indx) => {
      return indx <= 5
    })
    let photoDescriptions = photos.map((item, index) => { 
      if(this.state.photoDescriptions[index] !== '')
        return ''
      else
        return this.state.photoDescriptions[index]
    })
    if(photos.length >= 6)
      this.setState({ photos, photoDescriptions, maxed: true })
    else
      this.setState({ photos, photoDescriptions, maxed: false })
  }

  onDel = index => { 
    let { photos, photoDescriptions } = this.state
    photoDescriptions.splice(index, 1)
    photos.splice(index, 1)
    this.setState({
      photoDescriptions,
      photos,
      maxed: false
    })
  }

  clearPhotos = () => {
    this.setState({ photos: [], maxed: false })
  }

  render() {
    return (
      <div>
        { this.state.isLoading && <Loading /> }
        {!this.state.isLoading && 
          <div>
            <div className="sellContainer">
                <h1>List your gear</h1>
                <hr />
                <p>Before listing, please be aware that we are not responsible for the transactions that will occur. If you get beat, that's your L. We just provide the platform.</p>
              </div>
              <br />
              {this.state.errors.server && <ErrorMessage text={this.state.errors.server}/>}

              <form className="listingContainer">
                <div className="listingOption">
                  <br />
                  {this.state.errors.title && <label style={{color:'red'}}>Title is Required!</label>}
                  {!this.state.errors.title && <label>Title</label>}
                  <input 
                    name='title' 
                    type="text" 
                    id="titleInput" 
                    value={this.state.title} 
                    onChange={this.onChange}
                    required 
                  />
                  <br /><br />
                  {this.state.errors.brand && <label style={{color:'red'}}>{this.state.errors.brand}</label>}
                  {!this.state.errors.brand && <label>Brand</label>}
                  <input 
                    name='brand' 
                    type="text" 
                    id="titleInput" 
                    value={this.state.brand} 
                    onChange={this.onChange} 
                  />
                  <br /><br />
                  {this.state.errors.price && <label style={{color:'red'}}>{this.state.errors.price}</label>}
                  {!this.state.errors.price && <label>Price ($)</label>}
                  <input 
                    name='price' 
                    type="number" 
                    id="titleInput" 
                    value={this.state.price} 
                    onChange={this.onChange} 
                  />
                </div>
                <div className="listingOption">
                  <br />
                  {this.state.errors.category && <label style={{color:'red'}}>{this.state.errors.price}</label>}
                  {!this.state.errors.category && <label>Category</label>}
                  <Select
                    name="form-field-name"
                    className="listingSelect"
                    value={this.state.category}
                    options={categoryOptions}
                    onChange={this.categoryChange}
                  />
                  <br />
                  {this.state.errors.size && <label style={{color:'red'}}>{this.state.errors.size}</label>}
                  {!this.state.errors.size && <label>Size</label>}
                  <Creatable
                    placeholder="Select or Create..."
                    name="form-field-name"
                    className="listingSelect"
                    value={this.state.size}
                    options={this.state.currentCat}
                    onChange={this.sizeChange}
                  />
                  <br />
                  {this.state.errors.condition && <label style={{color:'red'}}>{this.state.errors.condition}</label>}
                  {!this.state.errors.condition && <label>Condition</label>}
                  <Select
                    name="form-field-name"
                    className="listingSelect"
                    value={this.state.condition}
                    options={conditionOptions}
                    onChange={this.condoChange}
                  />
                </div>
                <br/>
                <div className="listingTextarea">
                  {this.state.errors.description && <label style={{color:'red'}}>{this.state.errors.description}</label>}
                  {!this.state.errors.description && <label>Description</label>}
                  <textArea
                    name="description"
                    onChange={this.onChange}
                    value={this.state.description}
                  />
                </div>
              </form>
              <div className="sellContainer">
                <h1>Photos</h1>
                <hr />
                <p>Add photos to spark interest in your listing.</p>
                <br/>
                {this.state.errors.photos && <ErrorMessage text={this.state.errors.photos}/>}
                <br/>
                <Dropzone
                  disabled={this.state.maxed ? true : false}
                  onDrop={this.onDrop}
                  accept="image/*" 
                  name="Test"
                  className="sellDropzone"
                  activeClassName="sellDropzone active"
                  multiple>
                  <FontAwesome
                    className={this.state.maxed ? 'disabled' : ''}
                    id="faPhotos"
                    name={this.state.maxed ? 'times' : 'file-photo-o'} />
                </Dropzone>
                <br/>
                {
                  this.state.photos.length > 1 && 
                  <span 
                    className='deleteAll' 
                    onClick={this.clearPhotos}>
                    Clear all &times;
                  </span>
                }
                <span className="previewContainer">
                  {this.state.photos.map((preview, key) => {
                    return (
                      <ImageCard 
                        src={preview} 
                        key={key} 
                        indx={key} 
                        onDel={this.onDel} 
                        description={this.state.photoDescriptions[key]}
                        onChangeDesc={this.onChangeDesc}
                      />
                    )
                  })}
                </span>
              <br/>
              <button 
                type="submit"
                className="sellButton"
                onClick={this.onSubmit}>
                Create Listing
              </button>
              <br/><br/>
            </div>
          </div>
          }
      </div>
    )
  }
}

function mapStateToProps(state){
  return {
    user: state.user
  }
}

Sell.contextTypes = {
  router: PropTypes.object.isRequired
}

export default withRouter(connect(mapStateToProps, { sell })(Sell))


