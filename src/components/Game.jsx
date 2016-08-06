import React from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'
import { get_game, submit_pick_gems, submit_reserve_card,
         submit_buy_card, check_for_new_turn } from '../actions'

class Game extends React.Component {
  constructor() {
    super()
    this.state = {}
    this.pickAction = this.pickAction.bind(this)
    this.pickGem = this.pickGem.bind(this)
    this.unpickGem = this.unpickGem.bind(this)
    this.redoPicks = this.redoPicks.bind(this)
    this.doneGemPicks = this.doneGemPicks.bind(this)
    this.discardGem = this.discardGem.bind(this)
    this.doneDiscardingGems = this.doneDiscardingGems.bind(this)
    this.setInitialState = this.setInitialState.bind(this)
    this.pickCard = this.pickCard.bind(this)
    this.doneReserveCardPick = this.doneReserveCardPick.bind(this)
    this.toggleHand = this.toggleHand.bind(this)
    this.doneBuyCardPick = this.doneBuyCardPick.bind(this)
    this.showPlayerDeets = this.showPlayerDeets.bind(this)
  }

  componentDidMount() {
    console.log('component mounted', this.props)
    const { dispatch } = this.props
    const { game_id } = this.props.params
    if (this.props.fetching) {
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

    if ( current_player.hand.length == 0 ) {
      this.state = {
        show_player_hand: this.state.show_player_hand
      }
    }
    else {
      this.state = {
        showHand: this.state.showHand,
        show_player_hand: this.state.show_player_hand
      }
    }

    if ( current_player.id == meta.current_turn_player_id ) {
      this.setState({
        myTurn: true,
        turnState: 'PICK_ACTION',
        turnObjects: {}
      })
    }
  }

  componentWillReceiveProps(newProps) {
    // console.log('got new props', newProps, 'old props', this.props)

    if ( !this.props.meta || (newProps.meta.turn_number != this.props.meta.turn_number) ) {
      console.log('setting initial state')
      clearTimeout(this.poll)
      this.setInitialState(newProps)
    }

    // this.startPoll()
  }

  startPoll() {
    const { dispatch } = this.props
    const { game_id } = this.props.params

    this.poll = setTimeout(() => {
      dispatch(get_game(parseInt(game_id)))
    }, 8000)
  }

  toggleHand() {
    this.setState({
      showHand: !this.state.showHand
    }, () => {
      // console.log('hand toggled', this.state)
    })
  }

  doneBuyCardPick() {
    const { dispatch } = this.props
    const { turnObjects } = this.state

    this.setState({
      submittingTurn: true
    })

    setTimeout(() => {
      dispatch(submit_buy_card(
        this.props.game_id,
        {
          card_id: turnObjects.card.id
        }
      ))
    }, 0)

    console.log('done picking the card i wanna buy!')
  }

  doneReserveCardPick() {
    console.log('done card pick')
    const { dispatch } = this.props
    const { turnState } = this.state

    // TODO
    if (this.totalGemsInHand() > 10) {
      console.log('too many gems')

      this.setState({
        turnState: 'DISCARD_GEMS',
        turnAction: turnState,
        discardedGems: {}
      }, () =>
        console.log('done picks', this.state)
      )
    }
    else {
      console.log('submiting reserve turn with no discarded gems!')
      this.setState({
        submittingTurn: true
      })
      setTimeout(() => {
        dispatch(submit_reserve_card(
          this.props.game_id,
          {
            turnState: this.state.turnState,
            gems: this.state.turnObjects.gems,
            card_id: this.state.turnObjects.card.id
          }
        ))
      }, 0)
    }
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
        break
      case 'RESERVE_CARD':
        this.setState({
          turnState: action,
          turnObjects: {
            gems: {
              yellow: 1
            },
            card: {}
          }
        })
        break
      case 'BUY_CARD':
        this.setState({
          turnState: action,
          turnObjects: {
            card: {}
          }
        })
        break
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

    return total
  }

  canDiscardedGemBePicked(coin) {
    // TODO fix
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

    if ( turnState == 'TAKE_GEMS' || turnState == 'DISCARD_GEMS' || turnState == 'RESERVE_CARD') {
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
        <button className='btn' onClick={this.doneGemPicks} key='donepicking'>
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

  doneGemPicks() {
    const { dispatch } = this.props
    const { turnState } = this.state

    // TODO fix
    if (this.totalGemsInHand() > 10) {
      console.log('too many gems')

      this.setState({
        turnState: 'DISCARD_GEMS',
        turnAction: turnState,
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
      }, 0)
    }
  }

  pickCard(card) {
    const { turnState } = this.state

    if ( turnState == 'RESERVE_CARD' ) {
      console.log('pick card', card)
      const { turnObjects } = this.state
      turnObjects.card = card
      this.setState({
        turnObjects: turnObjects
      }, () => {
        console.log('card picked', this.state)
      })
    }

    if ( turnState == 'BUY_CARD' && this.canCurrentPlayerBuyCard(card) ) {
      console.log('buy card', card)
      const { turnObjects } = this.state
      turnObjects.card = card
      this.setState({
        turnObjects: turnObjects
      }, () => {
        console.log('card picked', this.state)
      })
    }
  }

  renderCardPicked() {
    const { card } = this.state.turnObjects

    if ( this.objEmpty(card) ) {
      return <div className='gem-slot card-slot'></div>
    }
    else {
      return (
        <div className={classNames('card', card.gem_value)}>
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
          <img className='value-gem' src={`https://dsgcewkenvygd.cloudfront.net/gems/${card.gem_value}.png`}/>
        </div>
      )
    }
  }

  discardDoneButton() {
    var handTotal = this.totalGemsInHand(true)

    console.log('discard button', handTotal)

    // TODO
    if ( handTotal > 10 ) {
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
    const { turnState, turnAction } = this.state

    this.setState({
      submittingTurn: true
    })

    console.log('done discarding', this.state);

    switch ( turnAction ) {
      case 'TAKE_GEMS':
        setTimeout(() => {
          dispatch(submit_pick_gems(
            this.props.game_id,
            {
              turnState: this.state.turnState,
              gems: this.state.turnObjects.gems,
              discardedGems: this.state.discardedGems
            }
          ))
        }, 0)
        break
      case 'RESERVE_CARD':
        setTimeout(() => {
          dispatch(submit_reserve_card(
            this.props.game_id,
            {
              turnState: this.state.turnState,
              gems: this.state.turnObjects.gems,
              card_id: this.state.turnObjects.card.id,
              discardedGems: this.state.discardedGems
            }
          ))
        }, 0)
        break
    }


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

  canReserveCard() {
    const { current_player } = this.props

    if ( current_player.hand.length == 3 ) {
      return false
    }
    else {
      return true
    }
  }

  boardCardClasses(card) {
    const { turnState } = this.state

    switch ( turnState ) {
      case 'RESERVE_CARD':
        return classNames('card',
                          card.gem_value,
                          'active-glow')
        break
      case 'BUY_CARD':
        return classNames('card',
                          card.gem_value,
                          {
                            'active-glow': this.canCurrentPlayerBuyCard(card)
                          })
        break
      default:
        return classNames('card',
                          card.gem_value)
        break
    }
  }

  canCurrentPlayerBuyCard(card) {
    const { current_player } = this.props

    var canAfford = true
    var totalInventory = 0
    var totalCost = 0

    for ( var i=0; i < card.cost.length; i++ ) {
      var gemCost = card.cost[i]
      var inventory = current_player.inventory
      var handValue = (inventory.coins[gemCost.color] || 0) +
                      (inventory.gems[gemCost.color] || 0)

      totalCost = totalCost + gemCost.amount

      if ( handValue < gemCost.amount ) {
        canAfford = false
        totalInventory = totalInventory + handValue
      }
      else {
        totalInventory = totalInventory + gemCost.amount
      }

      if ( card.id == 46 ) {
        console.log('affordance', 'gemCost', gemCost, 'handValue', handValue)
      }
    }

    if ( totalInventory + current_player.inventory.coins.yellow >= totalCost) {
      canAfford = true
    }

    if ( card.id == 46 ) {
      console.log('affordance', 'canafford', canAfford, 'totalinv', totalInventory, 'current p', current_player, 'totalcost', totalCost)
    }

    return canAfford
  }

  canReserveJoker() {
    if ( this.boardCoinAmount('yellow') > 0) {
      return true
    }
    else {
      return false
    }
  }

  handyClass() {
    return classNames(
      'handy',
      'btn',
      {
        'active-glow': this.handContainsPurchasableCards()
      }
    )
  }

  handContainsPurchasableCards() {
    const { turnState } = this.state

    if ( turnState == 'BUY_CARD' ) {
      const { current_player } = this.props

      for ( var i=0; i < current_player.hand.length; i++ ) {
        if ( this.canCurrentPlayerBuyCard(current_player.hand[i]) ) {
          return true
        }
      }
    }

    return false
  }

  reserveButtonDisabled() {
    const { card } = this.state.turnObjects

    if ( this.objEmpty(card) ) {
      return true
    }
    else {
      return false
    }
  }

  handEmpty() {
    const { current_player } = this.props

    if ( current_player.hand.length == 0 )
      return true
    else
      return false
  }

  lastRound() {
    const { game_players } = this.props

    for ( var i=0; i < game_players.length; i++ ) {
      if ( game_players[i].points >= 15 ) {
        return true
      }
    }

    return false
  }

  roundNumber(turn) {
    const { game_players } = this.props

    return Math.ceil(turn/game_players.length)
  }

  didIWin() {
    const { game_stat, current_player } = this.props

    if ( game_stat.winner.player_id == current_player.id ) {
      return true
    }
    else {
      return false
    }
  }

  didIWinText() {
    const { game_stat, current_player } = this.props

    if ( this.didIWin() ) {
      return "You won! :)"
    }
    else {
      return "You Lose :("
    }
  }

  currentTurnPlayerName() {
    const { game_players, meta } = this.props

    for ( var i=0; i < game_players.length; i++ ) {
      if ( game_players[i].id == meta.current_turn_player_id ) {
        return game_players[i].user.name
      }
    }
  }

  renderPlayerPoints() {
    const { game_players } = this.props

    var player_elements = []
    var sortedPlayers = game_players.sort((a, b) => {
      return b.points - a.points
    })

    console.log('sorted players', sortedPlayers)

    for ( var i=0; i < sortedPlayers.length; i++ ) {
      player_elements.push(
        <div className='player-point'>
          <img src={sortedPlayers[i].user.avatar_url}/>
          {sortedPlayers[i].user.name} - {sortedPlayers[i].points} points
        </div>
      )
    }

    return player_elements
  }

  playerDeetsClasses(player_id) {
    const { current_player } = this.props
    const { show_player_hand } = this.state

    if ( current_player.id == player_id || show_player_hand != player_id ) {
      return classNames(
        'player-deets',
        'hidden'
      )
    }
    else {
      return classNames(
        'player-deets'
      )
    }
  }

  showPlayerDeets(player_id) {
    const { show_player_hand } = this.state

    if ( show_player_hand == player_id ) {
      this.setState({
        show_player_hand: null
      })
    }
    else {
      this.setState({
        show_player_hand: player_id
      })
    }
  }

  render() {
    const { current_player, board, game_players, meta, fetching, game_stat } = this.props

    return (
      <div id='main' key={Date.now()}>

        {(fetching || this.state.submittingTurn) &&
          <div className="overloader">
            <div className="text">
              <img src="https://dsgcewkenvygd.cloudfront.net/assets/loading-balls.svg"/>
            </div>
          </div>
        }
        {!fetching &&
          <div>
            {game_stat &&
              <div className='overloader game-over'>
                <div className='game-over-text'>
                  <h2>
                    Game over. {this.didIWinText()}
                  </h2>
                  <div className='details'>
                    {this.renderPlayerPoints()}
                  </div>
                  <div className='gif'>
                  {this.didIWin() &&
                    <img src='http://i.giphy.com/11Feog5PTumNnq.gif'/>
                  }
                  {!this.didIWin() &&
                    <img src='https://media.giphy.com/media/xDQ3Oql1BN54c/giphy.gif'/>
                  }
                  </div>
                </div>
              </div>
            }
            {this.state.myTurn &&
              <div className='turn-box'>
                {this.state.turnState != 'PICK_ACTION' &&
                  <div className='redo-round'
                       onClick={this.setInitialState.bind(this, this.props)}>
                    <i className='mdi mdi-replay'></i>
                    redo turn
                  </div>
                }
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
                      <button className='btn'
                              onClick={this.pickAction.bind(this, 'RESERVE_CARD')}
                              disabled={!this.canReserveCard()}>
                        Reserve Development
                      </button>
                      <button className='btn'
                              onClick={this.pickAction.bind(this, 'BUY_CARD')}>
                        Buy Development
                      </button>
                    </div>
                  </div>
                }
                {this.state.turnState == 'BUY_CARD' &&
                  <div className='turn-box-inner-wrap pick-card'>
                    <div className='turn-help'>
                      Pick the card you want to purchase
                    </div>
                    <div className='gems-picked picked-card'>
                      {this.renderCardPicked()}
                    </div>
                    <div className='actions'>
                      <button className='btn'
                              disabled={this.reserveButtonDisabled()}
                              onClick={this.doneBuyCardPick}>
                        End Turn
                      </button>
                    </div>
                  </div>
                }
                {this.state.turnState == 'RESERVE_CARD' &&
                  <div className='turn-box-inner-wrap pick-card'>
                    <div className='turn-help'>
                      Pick the card you want to reserve
                    </div>
                    {this.canReserveJoker() &&
                      <div className='gems-picked'>
                          <div className='coin-pile yellow'></div>
                      </div>
                    }
                    {this.canReserveJoker() &&
                      <div className='turn-help'> + </div>
                    }
                    <div className='gems-picked picked-card'>
                      {this.renderCardPicked()}
                    </div>
                    <div className='actions'>
                      <button className='btn'
                              disabled={this.reserveButtonDisabled()}
                              onClick={this.doneReserveCardPick}>
                        End Turn
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
                {this.currentTurnPlayerName()}'s turn, wait a while...
              </div>
            }
            <div className='players'>
              <div className='round'>
                Round {this.roundNumber(meta.turn_number)}
                {this.lastRound() &&
                  <div className='last-round'>
                    Last Round
                  </div>
                }
              </div>
            {game_players.map(player =>
              <div className='player-inner' key={player.id}>
                <div className={classNames('player', {'current-turn-player': player.id == meta.current_turn_player_id})}
                     onClick={this.showPlayerDeets.bind(this, player.id)}>
                  <div className='avatar'>
                    <img src={player.user.avatar_url} />
                  </div>
                  <div className='points'>
                    {player.points}
                  </div>
                </div>
                <div className={this.playerDeetsClasses(player.id)}>
                  <div className='item'>
                    <div className='mini-card green'>
                      <span>
                        {player.inventory.gems.green}
                      </span>
                    </div>
                    <div className='mini-coin green'>
                      <span>
                        {player.inventory.coins.green}
                      </span>
                    </div>
                  </div>
                  <div className='item'>
                    <div className='mini-card white'>
                      <span className='value'>
                        {player.inventory.gems.white}
                      </span>
                    </div>
                    <div className='mini-coin white'>
                      <span className='value'>
                        {player.inventory.coins.white}
                      </span>
                    </div>
                  </div>
                  <div className='item'>
                    <div className='mini-card blue'>
                      <span>
                        {player.inventory.gems.blue}
                      </span>
                    </div>
                    <div className='mini-coin blue'>
                      <span>
                        {player.inventory.coins.blue}
                      </span>
                    </div>
                  </div>
                  <div className='item'>
                    <div className='mini-card black'>
                      <span>
                        {player.inventory.gems.black}
                      </span>
                    </div>
                    <div className='mini-coin black'>
                      <span>
                        {player.inventory.coins.black}
                      </span>
                    </div>
                  </div>
                  <div className='item'>
                    <div className='mini-card red'>
                      <span>
                        {player.inventory.gems.red}
                      </span>
                    </div>
                    <div className='mini-coin red'>
                      <span>
                        {player.inventory.coins.red}
                      </span>
                    </div>
                  </div>
                  <div className='item'>
                    <div className='mini-card yellow'>
                      <span className='value'>
                        {player.inventory.gems.yellow}
                      </span>
                    </div>
                    <div className='mini-coin yellow'>
                      <span className='value'>
                        {player.inventory.coins.yellow}
                      </span>
                    </div>
                  </div>
                  <div className='item hand-size'>
                    <i className='mdi mdi-cards'></i>
                    {player.inventory.hand_count}
                  </div>
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
              {/*<button className='handy btn'*/}
              <button className={this.handyClass()}
                      onClick={this.toggleHand}
                      disabled={this.handEmpty()}>
                <i className='mdi mdi-cards' />
                <span>
                  {current_player.hand.length}
                </span>
              </button>
              {this.state.showHand &&
                <div className='my-hand'>
                  {current_player.hand.map( (card) =>
                    <div className={this.boardCardClasses(card)}
                         key={card.id}
                         onClick={this.pickCard.bind(this, card)}>
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
                      <img className='value-gem' src={`https://dsgcewkenvygd.cloudfront.net/gems/${card.gem_value}.png`}/>
                    </div>
                  )}
                </div>
              }
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
                  <div className={this.boardCardClasses(card)}
                       key={card.id}
                       onClick={this.pickCard.bind(this, card)}>
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
                    <img className='value-gem' src={`https://dsgcewkenvygd.cloudfront.net/gems/${card.gem_value}.png`}/>
                  </div>
                )}
              </div>
              <div className='card-row'>
                {board.cards.tier2.available_cards.map(card =>
                  <div className={this.boardCardClasses(card)}
                       key={card.id}
                       onClick={this.pickCard.bind(this, card)}>
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
                    <img className='value-gem' src={`https://dsgcewkenvygd.cloudfront.net/gems/${card.gem_value}.png`}/>
                  </div>
                )}
              </div>
              <div className='card-row'>
                <div className='card-pile' />
                {board.cards.tier1.available_cards.map(card =>
                  <div className={this.boardCardClasses(card)}
                       key={card.id}
                       onClick={this.pickCard.bind(this, card)}>
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
                    <img className='value-gem' src={`https://dsgcewkenvygd.cloudfront.net/gems/${card.gem_value}.png`}/>
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
  if (!state.game.fetching) {
    return {
      game_id: state.game.game_id,
      meta: state.game.meta,
      board: state.game.board,
      game_players: state.game.game_players,
      current_player: state.game.current_player,
      game_stat: state.game.game_stat,
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
