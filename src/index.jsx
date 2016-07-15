import React from 'react';
import ReactDOM from 'react-dom';
import Immutable from 'immutable';

import Game from './components/Game';

import {Provider} from 'react-redux';
import reducer from './reducer';
import {compose, createStore} from 'redux';

const createStoreDevTools = compose(
  window.devToolsExtension ? window.devToolsExtension() : f => f
)(createStore);

const store = createStoreDevTools(reducer);

const gameState = {
  meta: {
    turn_number: 1,
    turn_player_id: 2
  },
  board: {
    coins: {
      green: 2,
      white: 5,
      blue: 1,
      black: 0,
      red: 4,
      yellow: 6
    },
    cards: {
      tier1: {
        cardsRemaining: 20,
        available_cards: [
          {
            id: 1,
            backgroundImage: "url",
            point_value: 0,
            gem_value: "blue",
            cost: [
              {
                color: "white",
                amount: 2
              },
              {
                color: "red",
                amount: 1
              }
            ]
          },
          {
            id: 2,
            backgroundImage: "url",
            point_value: 0,
            gem_value: "red",
            cost: [
              {
                color: "black",
                amount: 1
              },
              {
                color: "red",
                amount: 1
              }
            ]
          },
          {
            id: 3,
            backgroundImage: "url",
            point_value: 0,
            gem_value: "green",
            cost: [
              {
                color: "green",
                amount: 1
              },
              {
                color: "blue",
                amount: 1
              },
              {
                color: "white",
                amount: 1
              },
              {
                color: "red",
                amount: 1
              }
            ]
          }
          ,
          {
            id: 4,
            backgroundImage: "url",
            point_value: 0,
            gem_value: "blue",
            cost: [
              {
                color: "black",
                amount: 2
              },
              {
                color: "red",
                amount: 2
              }
            ]
          }
        ]
      },
      tier3: {
        cardsRemaining: 10,
        available_cards: [
          {
            id: 9,
            backgroundImage: "url",
            point_value: 6,
            gem_value: "white",
            cost: [
              {
                color: "red",
                amount: 6
              }
            ]
          },
          {
            id: 10,
            backgroundImage: "url",
            point_value: 4,
            gem_value: "green",
            cost: [
              {
                color: "black",
                amount: 3
              },
              {
                color: "red",
                amount: 3
              },
              {
                color: "white",
                amount: 2
              }
            ]
          },
          {
            id: 11,
            backgroundImage: "url",
            point_value: 5,
            gem_value: "blue",
            cost: [
              {
                color: "green",
                amount: 3
              },
              {
                color: "black",
                amount: 2
              },
              {
                color: "blue",
                amount: 3
              },
              {
                color: "red",
                amount: 2
              }
            ]
          },
          {
            id: 12,
            backgroundImage: "url",
            point_value: 3,
            gem_value: "blue",
            cost: [
              {
                color: "black",
                amount: 4
              },
              {
                color: "red",
                amount: 4
              }
            ]
          }
        ]
      },
      tier2: {
        cardsRemaining: 10,
        available_cards: [
          {
            id: 5,
            backgroundImage: "url",
            point_value: 2,
            gem_value: "green",
            cost: [
              {
                color: "red",
                amount: 3
              },
              {
                color: "green",
                amount: 1
              }
            ]
          },
          {
            id: 6,
            backgroundImage: "url",
            point_value: 1,
            gem_value: "black",
            cost: [
              {
                color: "black",
                amount: 3
              },
              {
                color: "white",
                amount: 1
              },
              {
                color: "green",
                amount: 2
              }
            ]
          },
          {
            id: 7,
            backgroundImage: "url",
            point_value: 1,
            gem_value: "white",
            cost: [
              {
                color: "green",
                amount: 2
              },
              {
                color: "black",
                amount: 2
              },
              {
                color: "blue",
                amount: 2
              },
              {
                color: "red",
                amount: 2
              }
            ]
          },
          {
            id: 8,
            backgroundImage: "url",
            point_value: 3,
            gem_value: "blue",
            cost: [
              {
                color: "black",
                amount: 4
              }
            ]
          }
        ]
      }
    },
    nobles: [
      {
        id: 1,
        backgroundImage: "url",
        point_value: 3,
        cost: [
          {
            color: "blue",
            amount: 3
          },
          {
            color: "red",
            amount: 3
          },
          {
            color: "black",
            amount: 3
          }
        ]
      },
      {
        id: 2,
        backgroundImage: "url",
        point_value: 2,
        cost: [
          {
            color: "black",
            amount: 4
          },
          {
            color: "white",
            amount: 4
          }
        ]
      },
      {
        id: 3,
        backgroundImage: "url",
        point_value: 2,
        cost: [
          {
            color: "yellow",
            amount: 4
          },
          {
            color: "red",
            amount: 4
          }
        ]
      },
      {
        id: 4,
        backgroundImage: "url",
        point_value: 5,
        cost: [
          {
            color: "green",
            amount: 3
          },
          {
            color: "blue",
            amount: 3
          },
          {
            color: "red",
            amount: 3
          }
        ]
      },
      {
        id: 5,
        backgroundImage: "url",
        point_value: 2,
        cost: [
          {
            color: "black",
            amount: 4
          },
          {
            color: "red",
            amount: 4
          }
        ]
      }
    ]
  },
  game_players: [
    {
      id: 1,
      avatarImage: "url",
      points: 5,
      inventory: {
        hand_count: 3,
        coins: {
          green: 2,
          white: 5,
          blue: 1,
          black: 0,
          red: 4,
          yellow: 6
        },
        gems: {
          green: 0,
          white: 1,
          blue: 3,
          black: 0,
          red: 6,
          yellow: 0
        }
      }
    },
    {
      id: 2,
      avatarImage: "url",
      points: 7,
      inventory: {
        hand_count: 3,
        coins: {
          green: 2,
          white: 3,
          blue: 1,
          black: 1,
          red: 4,
          yellow: 3
        },
        gems: {
          green: 2,
          white: 1,
          blue: 3,
          black: 4,
          red: 5,
          yellow: 0
        }
      }
    },
    {
      id: 3,
      avatarImage: "url",
      points: 3,
      inventory: {
        hand_count: 2,
        coins: {
          green: 1,
          white: 3,
          blue: 1,
          black: 1,
          red: 4,
          yellow: 3
        },
        gems: {
          green: 2,
          white: 1,
          blue: 5,
          black: 4,
          red: 3,
          yellow: 2
        }
      }
    },
    {
      id: 4,
      avatarImage: "url",
      points: 2,
      inventory: {
        hand_count: 1,
        coins: {
          green: 1,
          white: 3,
          blue: 3,
          black: 1,
          red: 5,
          yellow: 3
        },
        gems: {
          green: 2,
          white: 1,
          blue: 2,
          black: 4,
          red: 6,
          yellow: 0
        }
      }
    }
  ],
  current_player: {
    id: 2,
    avatarImage: "url",
    points: 3,
    inventory: {
      hand_count: 1,
      coins: {
        green: 1,
        white: 3,
        blue: 3,
        black: 1,
        red: 5,
        yellow: 3
      },
      gems: {
        green: 2,
        white: 1,
        blue: 2,
        black: 4,
        red: 6,
        yellow: 0
      }
    },
    hand: [
      {
        id: 4,
        backgroundImage: "url",
        point_value: 0,
        gem_value: "blue",
        cost: {
          white: 3
        }
      }
    ]
  }
}

require('./assets/stylesheets/screen.scss');

ReactDOM.render(
  <Game state={gameState}/>,
  document.getElementById('app')
);
