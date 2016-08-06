import React from 'react'
import { get_users, get_profile, new_game } from '../actions'
import { connect } from 'react-redux'
import classNames from 'classnames'
import { hashHistory } from 'react-router'


class Profile extends React.Component {

  constructor() {
    super()
    this.newGame = this.newGame.bind(this);
    this.closeNewGame = this.closeNewGame.bind(this);
    this.goToGame = this.goToGame.bind(this);
    this.startGame = this.startGame.bind(this);
    this.addPlayer = this.addPlayer.bind(this);
    this.state = {}
  }

  componentDidMount() {
    const { dispatch } = this.props

    dispatch(get_profile())
  }

  newGame() {
    this.setState({
      newGame: true,
      pickedPlayers: []
    })
  }

  closeNewGame() {
    this.setState({
      newGame: false
    })
  }

  startGame() {
    const { dispatch } = this.props
    this.state.pickedPlayers.push(this.props.my_profile.id)
    console.log(this.state.pickedPlayers)

    this.setState({
      startingNewGame: true
    })

    dispatch(new_game(this.state.pickedPlayers))
  }

  pickedPlayerCount() {
    const { pickedPlayers } = this.state
    return 1 + pickedPlayers.length
  }

  availablePlayerClasses(user_id) {
    const { pickedPlayers } = this.state

    return classNames(
      'available-player',
      {
        'active': pickedPlayers.indexOf(user_id) >= 0
      }
    )
  }

  addPlayer(user_id) {
    const { pickedPlayers } = this.state

    var index = pickedPlayers.indexOf(user_id)

    if ( index >= 0 ) {
      pickedPlayers.splice(index, 1)
      this.setState({
        pickedPlayers: pickedPlayers
      })
    }
    else if ( pickedPlayers.length < 3 ) {
      pickedPlayers.push(user_id)
      this.setState({
        pickedPlayers: pickedPlayers
      })
    }
  }

  startGameDisabled() {
    const { pickedPlayers } = this.state

    if ( pickedPlayers.length >= 1 ) {
      return false
    }
    return true
  }

  goToGame(game_id) {
    hashHistory.push(`/game/${game_id}`)
  }

  renderGames() {
    const { games } = this.props

    if ( games.length > 0 ) {
      return games.map((game) =>
        <div className='game-wrap'
             key={game.id}
             onClick={this.goToGame.bind(this, game.id)}>
          <div className='game-name'>
            Game {game.id}
          </div>
          <div className='game-turn'>
            Turn #{game.turn}
          </div>
        </div>
      )
    }
    else {
      return (
        <div className='no-games'>
          You have no active games right now, start a new game!
        </div>
      )
    }
  }

  render() {
    const { users, games, fetching } = this.props

    return (
      <div className="profile-wrap">
        {fetching || this.state.startingNewGame &&
          <div className="overloader">
            <div className="text">
              <img src="https://dsgcewkenvygd.cloudfront.net/assets/loading-balls.svg"/>
            </div>
          </div>
        }
        {!fetching &&
          <div>
            {this.state.newGame &&
              <div className='pick-players-wrap'>
                <div className='pick-players-inner'>
                  <h3>
                    Pick up to 3 players to start the game with.
                  </h3>
                  <div className='players-list'>
                    {users.map((user) =>
                      <div className={this.availablePlayerClasses(user.id)}
                           key={user.id}
                           onClick={this.addPlayer.bind(this, user.id)}>
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
                          disabled={this.startGameDisabled()}
                          onClick={this.startGame}>
                    Start a {this.pickedPlayerCount()} Player Game
                  </button>
                  <div className='cancel'
                       onClick={this.closeNewGame}>
                    cancel
                  </div>
                </div>
              </div>
            }
            {!this.state.newGame &&
              <div className='profile-home'>
                <h1> Welcome back, friend. </h1>
                <div className='profile-inner'>
                  <div className='left'>
                    <h3>Your Games</h3>
                    {this.renderGames()}
                  </div>
                </div>
                <button className="btn start-new" onClick={this.newGame}>
                  Start a New Game
                </button>
              </div>
            }
          </div>
        }
      </div>
    )
  }
}

function mapStateToProps(state) {
  console.log('mapping state', state)

  const { fetching } = state.home

  if ( !fetching ) {
    console.log('not fetching')
    return {
      users: state.home.users,
      games: state.home.games,
      my_profile: state.home.my_profile
    }
  } else {
    console.log('fetching')
    return {
      fetching: true
    }
  }
}

export default connect(mapStateToProps)(Profile)
