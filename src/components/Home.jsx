import React from 'react'
import { Link, hashHistory } from 'react-router'
import { new_game } from '../actions'
import { connect } from 'react-redux'

class Home extends React.Component {
  constructor() {
    console.log('constructed')
    super()
    this.buttonclicked = this.buttonclicked.bind(this);
    this.state = {}
  }

  componentDidMount() {
    console.log('mounted')
    console.log('process env', process)
  }


  buttonclicked() {
    const { dispatch } = this.props
    this.setState({
      fetching: true
    })
    console.log(this.state)
    console.log('dispatching new game')
    dispatch(new_game([1,2,3]))
  }

  render() {
    return (
      <div className="home-wrap">
        {this.state.fetching &&
          <div className="overloader">
            <div className="text">
              <img src="https://s3.amazonaws.com/splendor-general/assets/loading-balls.svg"/>
            </div>
          </div>
        }
        <h1> Welcome back, friend. </h1>
        <button className="btn" onClick={this.buttonclicked}>
          Start a New Game
        </button>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {}
}

export default connect(mapStateToProps)(Home)
