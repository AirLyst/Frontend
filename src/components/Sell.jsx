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

class Sell extends Component {

  state = {
    categoryValue: "tops",
    sizeValue: "s",
    condoValue: "new",
    title: "",
    description: "",
    currentCat: [...sizing.oneSize, ...sizing.tops],
    photos: [],
    maxed: false
  }

  componentDidUpdate() {
    let state = JSON.stringify(this.state)
    state !== localStorage['cache-sell'] && localStorage.setItem('cache-sell', state)
  }

  componentWillMount() {
    //if there is localstorage saved, load it. otherwise do nothing
    if (localStorage['cache-sell']) {
      let cachedState = JSON.parse(localStorage['cache-sell'])
      this.setState(cachedState)
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

  onDel = src => {
    this.setState({
      photos: this.state.photos.filter((curr) => {
        return curr !== src
      }),
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
            <br />
            <label>Title</label>
            <input name='title' type="text" id="titleInput" value={this.state.title} onChange={this.onChange} />
          </div>
          <span className="listingDescription">
            <label>Description</label>
            <textarea
              onChange={this.onChange}
              value={this.state.description}
              name="description"
            />
          </span>
        </div>
        <br />
        <br />
        <div className="sellContainer">
          <h1>Add photos</h1>
          {this.state.photos.length > 1 && <div className='deleteAll' onClick={() => { this.setState({ photos: [], maxed: false }) }}>delete all</div>}
          <hr />
          <Dropzone
            disabled={this.state.maxed ? true : false}
            onDrop={this.onDrop}
            name="Test"
            className="sellDropzone"
            multiple>
            <FontAwesome
              className={this.state.maxed ? 'disabled' : ''}
              id="faCamera"
              name={this.state.maxed ? 'times' : 'camera-retro'} />
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


const categoryOptions = [
  { value: "tops", label: 'Tops' },
  { value: "bottoms", label: 'Bottoms' },
  { value: "kicks", label: 'Kicks' },
  { value: "accessories", label: 'Accessories' },
  { value: "headwear", label: 'Headwear' },
]



const sizing = {
  oneSize: [
    { value: "one size", label: 'One Size' }
  ],
  tops: [
    { value: "xxs", label: 'XX-Small' },
    { value: "xs", label: 'X-Small' },
    { value: "s", label: 'Small' },
    { value: "m", label: 'Medium' },
    { value: "l", label: 'Large' },
    { value: "xl", label: 'X-Large' },
    { value: "xxl", label: 'XX-Large' },
  ],
  kicks: [
    { value: 6, label: '6' },
    { value: 6.5, label: '6.5' },
    { value: 7, label: '7' },
    { value: 7.5, label: '7.5' },
    { value: 8, label: '8' },
    { value: 8.5, label: '8.5' },
    { value: 9, label: '9' },
    { value: 9.5, label: '9.5' },
    { value: 10, label: '10' },
    { value: 10.5, label: '10.5' },
    { value: 11, label: '11' },
    { value: 11.5, label: '11.5' },
    { value: 12, label: '12' },
    { value: 12.5, label: '12.5' },
    { value: 13, label: '13' },
    { value: 13.5, label: '13.5' },
    { value: 14, label: '14' },
    { value: 14.5, label: '14.5' },
    { value: 15, label: '15' },
  ],
  bottoms: [
    { value: 26, label: '26' },
    { value: 27, label: '27' },
    { value: 28, label: '28' },
    { value: 29, label: '29' },
    { value: 30, label: '30' },
    { value: 31, label: '31' },
    { value: 32, label: '32' },
    { value: 33, label: '33' },
    { value: 34, label: '34' },
    { value: 35, label: '35' },
    { value: 36, label: '36' },
    { value: 37, label: '37' },
    { value: 38, label: '38' },
    { value: 39, label: '39' },
    { value: 40, label: '40' },
    { value: 41, label: '41' },
    { value: 42, label: '42' },
    { value: 43, label: '43' },
    { value: 44, label: '44' },
  ],
  accessories: [
    { value: "xxs", label: 'XX-Small' },
    { value: "xs", label: 'X-Small' },
    { value: "s", label: 'Small' },
    { value: "m", label: 'Medium' },
    { value: "l", label: 'Large' },
    { value: "xl", label: 'X-Large' },
    { value: "xxl", label: 'XX-Large' },
    { value: 6, label: '6' },
    { value: 6.5, label: '6.5' },
    { value: 7, label: '7' },
    { value: 7.5, label: '7.5' },
    { value: 8, label: '8' },
    { value: 8.5, label: '8.5' },
    { value: 9, label: '9' },
    { value: 9.5, label: '9.5' },
    { value: 10, label: '10' },
    { value: 10.5, label: '10.5' },
    { value: 11, label: '11' },
    { value: 11.5, label: '11.5' },
    { value: 12, label: '12' },
    { value: 12.5, label: '12.5' },
    { value: 13, label: '13' },
    { value: 13.5, label: '13.5' },
    { value: 14, label: '14' },
    { value: 14.5, label: '14.5' },
    { value: 15, label: '15' },
    { value: 26, label: '26' },
    { value: 27, label: '27' },
    { value: 28, label: '28' },
    { value: 29, label: '29' },
    { value: 30, label: '30' },
    { value: 31, label: '31' },
    { value: 32, label: '32' },
    { value: 33, label: '33' },
    { value: 34, label: '34' },
    { value: 35, label: '35' },
    { value: 36, label: '36' },
    { value: 37, label: '37' },
    { value: 38, label: '38' },
    { value: 39, label: '39' },
    { value: 40, label: '40' },
    { value: 41, label: '41' },
    { value: 42, label: '42' },
    { value: 43, label: '43' },
    { value: 44, label: '44' },
  ],
  headwear: [
    { value: "xxs", label: 'XX-Small' },
    { value: "xs", label: 'X-Small' },
    { value: "s", label: 'Small' },
    { value: "m", label: 'Medium' },
    { value: "l", label: 'Large' },
    { value: "xl", label: 'X-Large' },
    { value: "xxl", label: 'XX-Large' },
  ]
}



const conditionOptions = [
  { value: "new", label: "New" },
  { value: "worn", label: "Worn" },
  { value: "trash", label: "Trash" }
]
