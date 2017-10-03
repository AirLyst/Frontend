import React, { Component } from 'react';
import PropTypes      from 'prop-types'
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux'
import Select, { Creatable } from 'react-select';
import FontAwesome from 'react-fontawesome'
import Dropzone from 'react-dropzone'
import ImageCard from './ItemImage'
import { DoubleBounce } from 'better-react-spinkit'

// Components
import Loading from './Loading.jsx'

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
      isLoading: false,
      maxed: false
    }))
  }

  componentWillMount() {
    if (localStorage['cache-sell']) {
      this.setState(JSON.parse(localStorage['cache-sell']))
    }
  }

   onSubmit =  async e => {
    e.preventDefault()
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
    .then(res => {
      this.context.router.history.push('/')
    })
    .catch(err => this.setState({ isLoading: false }))
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value })
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

                <div className="listingContainer">
                  <br />
                  <div className="listingOption">
                    <br />
                    <label>Title</label>
                    <input 
                      name='title' 
                      type="text" 
                      id="titleInput" 
                      value={this.state.title} 
                      onChange={this.onChange} 
                    />
                    <br /><br />
                    <label>Brand</label>
                    <input 
                      name='brand' 
                      type="text" 
                      id="titleInput" 
                      value={this.state.brand} 
                      onChange={this.onChange} 
                    />
                    <br /><br />
                    <label>Price ($)</label>
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
                    <label>Category</label>
                    <Select
                      name="form-field-name"
                      className="listingSelect"
                      value={this.state.category}
                      options={categoryOptions}
                      onChange={this.categoryChange}
                    />
                    <br />
                    <label>Size</label>
                    <Creatable
                      placeholder="Select or Create..."
                      name="form-field-name"
                      className="listingSelect"
                      value={this.state.size}
                      options={this.state.currentCat}
                      onChange={this.sizeChange}
                    />
                    <br />
                    <label>Condition</label>
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
                    <label>Description</label>
                    <textArea
                      name="description"
                      onChange={this.onChange}
                    />
                  </div>
                </div>
                <div className="sellContainer">
                  <h1>Add photos</h1>
                  <hr />
                  {
                    this.state.photos.length > 1 && 
                    <div 
                      className='deleteAll' 
                      onClick={() => { this.setState({ photos: [], maxed: false }) }}>
                      Clear All
                    </div>
                  }
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
                  <span className="previewContainer">
                    {this.state.photos.map((preview, key) => {
                      return (
                        <ImageCard 
                          src={preview} 
                          key={key} 
                          indx={key} 
                          onDel={this.onDel} 
                          description={this.state.photoDescriptions}
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
                </div>
            </div>
          }
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


