import React from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'
import { get_game, submit_pick_gems } from '../actions'

class Game extends React.Component {
  constructor() {
    super()
    this.state = {}
    this.pickAction = this.pickAction.bind(this)
    this.pickGem = this.pickGem.bind(this)
    this.unpickGem = this.unpickGem.bind(this)
    this.redoPicks = this.redoPicks.bind(this)
    this.donePicks = this.donePicks.bind(this)
    this.discardGem = this.discardGem.bind(this)
    this.doneDiscardingGems = this.doneDiscardingGems.bind(this)
  }

  componentDidMount() {
    console.log('component mounted', this.props)
    if (this.props.fetching) {
      const { dispatch } = this.props
      const { game_id } = this.props.params
      setTimeout(() => {
        dispatch(get_game(parseInt(game_id)))
      }, 0)
    }
    else {
      // this is ugly because componentWillReceiveProps doesn't get called
      // on the initial render, so we have to call it here
      this.setInitialState(this.props)
    }
  }

  setInitialState(props) {
    const { current_player, meta } = props
    this.state = {}

    if ( current_player.id == meta.current_turn_player_id ) {
      this.setState({
        myTurn: true,
        turnState: 'PICK_ACTION',
        turnObjects: {}
      })
    }
  }

  componentWillReceiveProps(newProps) {
    this.setInitialState(newProps)
  }

  pickAction(action) {
    switch (action) {
      case 'TAKE_GEMS':
        this.setState({
          turnState: action,
          turnObjects: {
            gems: {}
          }
        })
    }
  }

  objEmpty(obj) {
    return Object.keys(obj).length === 0 && obj.constructor === Object
  }

  objCount(obj, value) {
    return Object.keys(obj).length === value && obj.constructor === Object
  }

  canGemBePicked(coin) {
    const { turnState, turnObjects } = this.state
    const { board } = this.props

    // gems can only be picked if the action is TAKE_GEMS!
    if ( turnState == 'TAKE_GEMS' ) {
      // let's get the amount that's on the board right now
      var boardAmount = this.boardCoinAmount(coin)
      var gems = turnObjects.gems

      // if there's no gems left on the board or if it's yellow, return false no matter what
      if ( boardAmount == 0 || coin == 'yellow' ) {
        return false
      }

      // there are some gems already picked shit gets complicated
      if ( !this.objEmpty(gems) ) {

        // if we already have 2 of the same gem, return false
        for ( var key in gems ) {
          if ( gems[key] == 2 ) {
            return false
          }
        }

        // if we already have 3 gems, return false
        var total = 0
        for ( var key in gems ) {
          total = total + gems[key]
        }
        if ( total == 3 ) {
          return false
        }

        // if we already have this gem and
        // (there's only 2 left of this color OR if we already have 2 gems), return false
        if ( gems[coin] == 1 && (boardAmount <= 2 || this.objCount(gems, 2))) {
          return false
        }

        return true
      }
      // no gems are picked
      // so it's true if there are any left
      else if ( boardAmount > 0 ) {
        return true
      }
    }

    return false
  }

  pickGem(coin) {
    if ( this.canGemBePicked(coin) ) {
      const { turnObjects } = this.state
      turnObjects.gems[coin] = (turnObjects.gems[coin] || 0) + 1
      this.setState({turnObjects: turnObjects})
    }
  }

  unpickGem(coin) {
    const { turnObjects } = this.state
    turnObjects.gems[coin] = turnObjects.gems[coin] - 1
    this.setState({turnObjects: turnObjects})
  }

  coinPileClass(coin) {
    return classNames(
      'coin-pile',
      'show-count',
      coin,
      {
        'active-glow': this.canGemBePicked(coin)
      }
    )
  }

  discardedCoinPileClass(coin) {
    return classNames(
      'coin-pile',
      'show-count',
      coin,
      {
        'active-glow': this.canDiscardedGemBePicked(coin)
      }
    )
  }

  totalGemInHand(coin) {
    const { current_player } = this.props
    const { turnObjects, discardedGems } = this.state

    return ( current_player.inventory.coins[coin] ) +
           ( turnObjects.gems[coin] || 0 ) -
           ( discardedGems[coin] || 0 )
  }

  totalGemsInHand(include_discarded: false) {
    const { current_player } = this.props
    const { turnObjects, discardedGems } = this.state

    var myGems = current_player.inventory.coins
    var total = 0

    for ( var gem in myGems ) {
      total = total +
              ( myGems[gem] ) +
              ( turnObjects.gems[gem] || 0 )
      if ( include_discarded ) {
        total = total - ( discardedGems[gem] || 0 )
      }
    }

    console.log('total gems in hand', total)

    return total
  }

  canDiscardedGemBePicked(coin) {
    if ( this.totalGemsInHand(true) > 10 ) {
      if ( this.totalGemInHand(coin) > 0 ) {
        return true
      }
      return false
    }
    return false
  }

  boardCoinAmount(coin) {
    const { turnState, turnObjects } = this.state
    const { board } = this.props

    var boardAmount = board.coins[coin]

    if ( turnState == 'TAKE_GEMS' || turnState == 'DISCARD_GEMS' ) {
      return boardAmount - (turnObjects.gems[coin] || 0)
    }
    else {
      return boardAmount
    }
  }

  renderChosenGems() {
    const { turnObjects, submittingTurn } = this.state
    var gems = turnObjects.gems

    var returnee = []

    for ( var key in gems ) {
      for ( var i=0; i<gems[key]; i++) {
        returnee.push(
          <div className={classNames('coin-pile', key)}
               key={`coinpile${key}${i}`}></div>
        )
      }
    }

    returnee.push(
      <div className='actions' key='pickactions'>
        <button className='btn' onClick={this.donePicks} key='donepicking'>
          End Turn
        </button>
      </div>
    )

    return returnee
  }

  redoPicks() {
    const { turnObjects, turnState } = this.state

    turnObjects.gems = {}
    this.setState({
      turnState: 'TAKE_GEMS',
      turnObjects: turnObjects
    })

    console.log('redoing picks', this.state)
  }

  donePicks() {
    const { dispatch } = this.props

    if (this.totalGemsInHand() > 10) {
      console.log('too many gems')

      this.setState({
        turnState: 'DISCARD_GEMS',
        discardedGems: {}
      }, () =>
        console.log('done picks', this.state)
      )
    }
    else {
      console.log('submiting turn with no discarded gems!')
      this.setState({
        submittingTurn: true
      })
      setTimeout(() => {
        dispatch(submit_pick_gems(
          this.props.game_id,
          {
            turnState: this.state.turnState,
            gems: this.state.turnObjects.gems
          }
        ))
      }, 2000)
    }
  }

  discardDoneButton() {
    var handTotal = this.totalGemsInHand(true)

    console.log('discard button', handTotal)

    if ( handTotal > 1 ) {
      return (
        <button className='btn' disabled='disabled'>
          {handTotal - 10} left
        </button>
      )
    }
    else {
      return (
        <button className='btn'
                onClick={this.doneDiscardingGems}>
          Done
        </button>
      )
    }
  }

  doneDiscardingGems() {
    const { dispatch } = this.props
    this.setState({
      submittingTurn: true
    })

    setTimeout(() => {
      dispatch(submit_pick_gems(
        this.props.game_id,
        {
          turnState: this.state.turnState,
          gems: this.state.turnObjects.gems,
          discardedGems: this.state.discardedGems
        }
      ))
    }, 2000)
  }

  discardGem(coin) {
    if ( this.canDiscardedGemBePicked(coin) ) {
      const { discardedGems } = this.state
      discardedGems[coin] = (discardedGems[coin] || 0) + 1
      this.setState(
        {discardedGems: discardedGems}, () =>
        console.log('gem discarded', this.state)
      )
    }
  }

  renderMyGems() {
    const { current_player } = this.props
    const { turnObjects } = this.state

    var myGems = {}
    var inventoryCoins = current_player.inventory.coins
    for ( var key in inventoryCoins) {
      myGems[key] = inventoryCoins[key]
    }

    for ( var key in turnObjects.gems ) {
      myGems[key] = (myGems[key] || 0) + turnObjects.gems[key]
    }

    console.log('my gems', myGems)

    var renderedGems = []

    for ( var key in myGems ) {
      if (myGems[key] > 0) {
        renderedGems.push(
          <div className={this.discardedCoinPileClass(key)}
               key={`mycoinpile${key}`}
               onClick={this.discardGem.bind(this, key)}>
            <span className='count'>
              {this.totalGemInHand(key)}
            </span>
          </div>
        )
      }
    }

    return(
      <div className='gems-picked'>
        {renderedGems}
      </div>
    )
  }

  render() {
    const { current_player, board, game_players, meta, fetching } = this.props

    return (
      <div id='main' key={Date.now()}>
        {(fetching || this.state.submittingTurn) &&
          <div className="overloader">
            <div className="text">
              <img src="https://s3.amazonaws.com/splendor-general/assets/loading-balls.svg"/>
            </div>
          </div>
        }
        {!fetching &&
          <div>
            {this.state.myTurn &&
              <div className='turn-box'>
                {this.state.turnState == 'PICK_ACTION' &&
                  <div className='turn-box-inner-wrap'>
                    <div className='turn-help'>
                      Your turn, pick an action
                    </div>
                    <div className='actions'>
                      <button className='btn'
                              onClick={this.pickAction.bind(this, 'TAKE_GEMS')}>
                        Take Gems
                      </button>
                      <button className='btn'>
                        Reserve Card
                      </button>
                      <button className='btn'>
                        Buy Card
                      </button>
                    </div>
                  </div>
                }
                {this.state.turnState == 'TAKE_GEMS' &&
                  <div className='turn-box-inner-wrap'>
                    <div className='turn-help'>
                      Pick Gems you want (total <span className='bold'>{this.totalGemsInHand()}</span> gems in hand)
                    </div>
                    <div className='gems-picked'>
                      {this.objEmpty(this.state.turnObjects.gems) &&
                        <div>
                          <div className='gem-slot'></div>
                          <div className='gem-slot'></div>
                          <div className='gem-slot'></div>
                        </div>
                      }
                      {!this.objEmpty(this.state.turnObjects.gems) &&
                        this.renderChosenGems()
                      }
                    </div>
                  </div>
                }
                {this.state.turnState == 'DISCARD_GEMS' &&
                  <div className='turn-box-inner-wrap discard-gems'>
                    <div className='turn-help'>
                      {this.totalGemsInHand(true)}/10 Gems in hand, discard down to 10
                    </div>
                    {this.renderMyGems()}
                    <div className='actions'>
                      {this.discardDoneButton()}
                    </div>
                  </div>
                }
              </div>
            }
            {!this.state.myTurn &&
              <div className='turn-box other-player'>
                Vivian's turn, wait a while...
              </div>
            }
            <div className='players'>
            {game_players.map(player =>
              <div className={classNames('player', {'current-player': player.id == meta.current_turn_player_id})}
                   key={player.id}>
                <div className='avatar'>
                  <img src={player.user.avatar_url} />
                </div>
                <div className='points'>
                  {player.points}
                </div>
              </div>
            )}
            </div>
            <div className='my-panel'>
              <div className='avatar-wrap'>
                <div className='avatar'>
                  <img src={current_player.user.avatar_url} />
                </div>
                <div className='points'>
                  {current_player.points}
                </div>
              </div>
              <div className='collections'>
                <div className='item'>
                  <div className='mini-card green'>
                    <span>
                      {current_player.inventory.gems.green}
                    </span>
                  </div>
                  <div className='mini-coin green'>
                    <span>
                      {current_player.inventory.coins.green}
                    </span>
                  </div>
                </div>
                <div className='item'>
                  <div className='mini-card white'>
                    <span className='value'>
                      {current_player.inventory.gems.white}
                    </span>
                  </div>
                  <div className='mini-coin white'>
                    <span className='value'>
                      {current_player.inventory.coins.white}
                    </span>
                  </div>
                </div>
                <div className='item'>
                  <div className='mini-card blue'>
                    <span>
                      {current_player.inventory.gems.blue}
                    </span>
                  </div>
                  <div className='mini-coin blue'>
                    <span>
                      {current_player.inventory.coins.blue}
                    </span>
                  </div>
                </div>
                <div className='item'>
                  <div className='mini-card black'>
                    <span>
                      {current_player.inventory.gems.black}
                    </span>
                  </div>
                  <div className='mini-coin black'>
                    <span>
                      {current_player.inventory.coins.black}
                    </span>
                  </div>
                </div>
                <div className='item'>
                  <div className='mini-card red'>
                    <span>
                      {current_player.inventory.gems.red}
                    </span>
                  </div>
                  <div className='mini-coin red'>
                    <span>
                      {current_player.inventory.coins.red}
                    </span>
                  </div>
                </div>
                <div className='item'>
                  <div className='mini-card yellow'>
                    <span className='value'>
                      {current_player.inventory.gems.yellow}
                    </span>
                  </div>
                  <div className='mini-coin yellow'>
                    <span className='value'>
                      {current_player.inventory.coins.yellow}
                    </span>
                  </div>
                </div>
              </div>
              <div className='handy'>
                <i className='mdi mdi-cards' />
                <span>
                  {current_player.hand.length}
                </span>
              </div>
            </div>
            <div className='main-card-area'>
              <div className={classNames('currency-piles', {'active': this.state.turnState == 'TAKE_GEMS'})}>
                {Object.keys(board.coins).map( (key) =>
                  <div className={this.coinPileClass(key)}
                       key={`coinpile${key}`}
                       onClick={this.pickGem.bind(this, key)}>
                    <span className='count'>
                      {this.boardCoinAmount(key)}
                    </span>
                  </div>
                )}
              </div>
              <div className='nobles-list'>
                {board.nobles.map(noble =>
                  <div className='noble'
                       key={noble.id}>
                    <div className='cost'>
                      {noble.cost.map(costItem =>
                        <div className={classNames('mini-card', costItem.color)}
                             key={costItem.color}>
                          <span className='value'>
                            {costItem.amount}
                          </span>
                        </div>
                      )}
                    </div>
                    <span className='points'>
                      {noble.point_value}
                    </span>
                  </div>
                )}
              </div>
              <div className='card-row'>
                <div className='card-pile' />
                {board.cards.tier3.available_cards.map(card =>
                  <div className={classNames('card', card.gem_value)}
                       key={card.id}>
                    <div className='cost'>
                      {card.cost.map((costItem, index) =>
                        <div className={classNames('mini-coin', costItem.color)}
                             key={'1'+index}>
                          <span className='value'>
                            {costItem.amount}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className='points'>
                      {card.point_value > 0 ? card.point_value : ''}
                    </div>
                    <img className='value-gem' src={require('../assets/images/gems/'+card.gem_value+'.png')}/>
                  </div>
                )}
              </div>
              <div className='card-row'>
                {board.cards.tier2.available_cards.map(card =>
                  <div className={classNames('card', card.gem_value)}
                       key={card.id}>
                    <div className='cost'>
                      {card.cost.map((costItem, index) =>
                        <div className={classNames('mini-coin', costItem.color)}
                             key={'2'+index}>
                          <span className='value'>
                            {costItem.amount}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className='points'>
                      {card.point_value > 0 ? card.point_value : ''}
                    </div>
                    <img className='value-gem' src={require('../assets/images/gems/'+card.gem_value+'.png')}/>
                  </div>
                )}
              </div>
              <div className='card-row'>
                <div className='card-pile' />
                {board.cards.tier1.available_cards.map(card =>
                  <div className={classNames('card', card.gem_value)}
                       key={card.id}>
                    <div className='cost'>
                      {card.cost.map((costItem, index) =>
                        <div className={classNames('mini-coin', costItem.color)}
                             key={'1'+index}>
                          <span className='value'>
                            {costItem.amount}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className='points'>
                      {card.point_value > 0 ? card.point_value : ''}
                    </div>
                    <img className='value-gem' src={require('../assets/images/gems/'+card.gem_value+'.png')}/>
                  </div>
                )}
              </div>
            </div>
          </div>
        }
      </div>
    )
  }
}

function mapStateToProps(state) {
  console.log('mapping state to props', state)
  if (!state.game.fetching) {
    return {
      game_id: state.game.game_id,
      meta: state.game.meta,
      board: state.game.board,
      game_players: state.game.game_players,
      current_player: state.game.current_player,
      fetching: false
    }
  }
  else {
    console.log('No game in state detected')
    return {
      fetching: true
    }
  }
}

export default connect(mapStateToProps)(Game)
