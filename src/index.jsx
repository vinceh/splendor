import React from 'react';
import ReactDOM from 'react-dom';
import Immutable from 'immutable';

import Game from './components/Game';
import Home from './components/Home';
import {Provider} from 'react-redux';

import configureStore from './configureStore'
import { Router, Route, hashHistory, IndexRouter } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'

const store = configureStore()
const history = syncHistoryWithStore(hashHistory, store)

require('./assets/stylesheets/screen.scss');

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <Route path='/' component={Home} />
      <Route path='/game/:game_id' component={Game} />
    </Router>
  </Provider>,
  document.getElementById('app')
);
