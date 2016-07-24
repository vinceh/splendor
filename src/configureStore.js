import { createStore, applyMiddleware, compose, combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import thunkMiddleware from 'redux-thunk'
import * as reducers from './reducers';

const allReducers = Object.assign({}, reducers, {routing: routerReducer})

export default function configureStore(initialState) {
  return createStore(
    combineReducers(allReducers),
    initialState,
    compose(
      applyMiddleware( thunkMiddleware ),
      window.devToolsExtension ? window.devToolsExtension() : f => f
    )
  )
}
