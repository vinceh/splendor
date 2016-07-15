import React from 'react';
import classNames from 'classnames';

export default class TodoApp extends React.Component {

  render() {
    var current_player = this.props.state.current_player;
    var nobles = this.props.state.board.nobles;
    var coins = this.props.state.board.coins;
    var cards = this.props.state.board.cards;

    return (
      <div id='main'>
        <div className='turn-box'>
          <div className='turn-box-inner'>
            <div className='actions'>
              <button className='btn'>
                Take Gems
              </button>
              <button className='btn'>
                Buy Card
              </button>
              <button className='btn'>
                Reserve Card
              </button>
            </div>
          </div>
        </div>
        <div className='players'>
        {this.props.state.game_players.map(player =>
          <div className='player'
               key={player.id}>
            <div className='avatar'>
              <img src={require('../assets/images/vince.jpg')} />
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
              <img src={require('../assets/images/vince.jpg')} />
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
          <div className='currency-piles'>
            <div className='coin-pile green'>
              <span className='count'>
                {coins.green}
              </span>
            </div>
            <div className='coin-pile white'>
              <span className='count'>
                {coins.white}
              </span>
            </div>
            <div className='coin-pile blue'>
              <span className='count'>
                {coins.blue}
              </span>
            </div>
            <div className='coin-pile black'>
              <span className='count'>
                {coins.black}
              </span>
            </div>
            <div className='coin-pile red'>
              <div className='coin'></div>
              <div className='coin'></div>
              <div className='coin'></div>
              <div className='coin'></div>
              <div className='coin'></div>
              <span className='count'>
                {coins.red}
              </span>
            </div>
            <div className='coin-pile yellow'>
              <span className='count'>
                {coins.yellow}
              </span>
            </div>
          </div>
          <div className='nobles-list'>
            {nobles.map(noble =>
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
            {cards.tier3.available_cards.map(card =>
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
            {cards.tier2.available_cards.map(card =>
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
            {cards.tier1.available_cards.map(card =>
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
    )
  }
};
