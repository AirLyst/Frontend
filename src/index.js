import React from 'react';
import ReactDOM from 'react-dom';
import Routes from './Routes.jsx';
import registerServiceWorker from './registerServiceWorker';
import './index.css';
import './components/styles/keyframes.css'

require('./components/styles/_style.scss');

ReactDOM.render(<Routes />, document.getElementById('root'));
registerServiceWorker();
