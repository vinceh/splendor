import React from 'react'
import { hashHistory } from 'react-router'
import { get_users } from '../actions'
import { connect } from 'react-redux'
import classNames from 'classnames'

class Home extends React.Component {
  constructor() {
    console.log('constructed')
    super()
    this.pickPlayer = this.pickPlayer.bind(this);
    this.login = this.login.bind(this);
    this.state = {}
  }

  componentDidMount() {
    const { dispatch } = this.props

    console.log('mounted')
    if ( !window.localStorage.getItem('token') ) {
      console.log('YOU ARENT LOGGED IN')
      this.setState({
        userLoggedIn: false,
        fetching: true
      })
      dispatch(get_users())
    }
    else {
      this.setState({
        userLoggedIn: true
      })
      hashHistory.push(`/profile`)
    }
  }

  componentWillReceiveProps(newProps) {
    console.log('i got new props', this.props)
    const { fetching } = newProps

    if ( !fetching ) {
      console.log('logged in')
      this.setState({
        userLoggedIn: true
      })
    }
  }

  pickPlayer(user_id, token) {
    this.setState({
      picked_user_id: user_id,
      picked_player_token: token
    })
  }

  loginDisabled() {
    const { picked_user_id } = this.state

    if ( picked_user_id ) {
      return false
    }
    else {
      return true
    }
  }

  availablePlayerClasses(user_id) {
    const { picked_user_id } = this.state

    return classNames(
      'available-player',
      {
        'active': picked_user_id == user_id
      }
    )
  }

  login() {
    const { picked_player_token } = this.state

    window.localStorage.setItem('token', picked_player_token)
    hashHistory.push(`/profile`)
  }

  render() {
    const { users, fetching } = this.props

    return (
      <div className="home-wrap">
        {this.state.userLoggedIn &&
          <div className='login-wrap'>
            <h3>Who are you?</h3>
            <div className='list-available-players'>
              {users.map(user =>
                <div className={this.availablePlayerClasses(user.id)}
                     key={user.id}
                     onClick={this.pickPlayer.bind(this, user.id, user.token)}>
                  <div className='avatar'>
                    <img src={user.avatar_url}/>
                  </div>
                  <div className='username'>
                    {user.name}
                  </div>
                </div>
              )}
            </div>
            <button className='btn'
                    disabled={this.loginDisabled()}
                    onClick={this.login}>
              Login
            </button>
          </div>
        }
        {fetching &&
          <div className="overloader">
            <div className="text">
              <img src="https://dsgcewkenvygd.cloudfront.net/assets/loading-balls.svg"/>
            </div>
          </div>
        }
      </div>
    )
  }
}

function mapStateToProps(state) {
  console.log('mapping state to props', state)
  const { fetching } = state.home

  if ( !fetching ) {
    console.log('not fetching')
    return {
      users: state.home.users
    }
  } else {
    return {
      fetching: true
    }
  }
}

export default connect(mapStateToProps)(Home)
