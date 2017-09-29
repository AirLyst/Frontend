import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux'
import Select, { Creatable } from 'react-select';
import FontAwesome from 'react-fontawesome'
import Dropzone from 'react-dropzone'
import ImageCard from './ItemImage'

// Be sure to include styles at some point, probably during your bootstrapping
import 'react-select/dist/react-select.css';
import './styles/Sell.css'
import './styles/Dropzone.scss'

import { sizing, conditionOptions, categoryOptions } from './data/Sizing'

class Sell extends Component {

  state = {
    categoryValue: "tops",
    sizeValue: "s",
    condoValue: "new",
    title: "",
    price: "",
    brand: "",
    description: "",
    currentCat: [...sizing.oneSize, ...sizing.tops],
    photos: [],
    maxed: false
  }

  componentDidUpdate() {
    localStorage.setItem('cache-sell', JSON.stringify({
      ...this.state,
      photos: []
    }))
  }

  componentWillMount() {
    //if there is localstorage saved, load it. otherwise do nothing
    if (localStorage['cache-sell']) {
      this.setState(JSON.parse(localStorage['cache-sell']))
    }
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value })
  }

  onChangeDesc = (value, url) => {
    console.log(value, url)
    let photos = this.state.photos
    photos[url].description = value
    this.setState({ photos })
  }

  onSubmit = e => {
    e.preventDefault()
    localStorage['cache-sell'] = null
  }

  categoryChange = val => {
    if (!val)
      this.setState({ categoryValue: null, currentCat: null })
    else
      this.setState({ categoryValue: val.value, currentCat: [...sizing.oneSize, ...sizing[val.value]] })
  }

  sizeChange = val => {
    if (!val)
      this.setState({ sizeValue: null })
    else
      this.setState({ sizeValue: val.value })
  }

  condoChange = val => {
    if (!val)
      this.setState({ condoValue: null })
    else
      this.setState({ condoValue: val.value })
  }

  onDrop = (acceptedFiles, rejectedFiles) => {
    const imgBlobs = acceptedFiles.map(image => {
      let val = {}
      val.preview = image.preview
      val.description = ''
      return val
    })
    let photos = [...this.state.photos, ...imgBlobs]
    photos = photos.filter((curr, indx) => {
      return indx <= 5
    })
    photos.length >= 6 ? this.setState({ photos, maxed: true }) : this.setState({ photos, maxed: false })
  }

  onDel = index => { 
    let { photos } = this.state
    photos.splice(index, 1)
    this.setState({
      photos,
      maxed: false
    })
  }

  render() {
    return (
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
              value={this.state.categoryValue}
              options={categoryOptions}
              onChange={this.categoryChange}
            />
            <br />
            <label>Size</label>
            <Creatable
              placeholder="Select or Create..."
              name="form-field-name"
              className="listingSelect"
              value={this.state.sizeValue}
              options={this.state.currentCat}
              onChange={this.sizeChange}
            />
            <br />
            <label>Condition</label>
            <Select
              name="form-field-name"
              className="listingSelect"
              value={this.state.condoValue}
              options={conditionOptions}
              onChange={this.condoChange}
            />
          </div>
        </div>
        <br />
        <br />
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
              return <ImageCard src={preview} key={key} indx={key} onDel={this.onDel} onChangeDesc={this.onChangeDesc} />
            })}
          </span>
        </div>
      </div>
    );
  }
}

export default withRouter(connect()(Sell))


