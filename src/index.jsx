import React from 'react';
import ReactDOM from 'react-dom';
import Immutable from 'immutable';

import Game from './components/Game';

// const todos = List.of(
//   Map({id: 1, text: 'React', status: 'active', editing: false}),
//   Map({id: 2, text: 'Redux', status: 'active', editing: false}),
//   Map({id: 3, text: 'Immutable', status: 'completed', editing: false})
// );

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
            id: 2,
            backgroundImage: "url",
            point_value: 0,
            gem_value: "blue",
            cost: {
              white: 3
            }
          }
        ]
      }
    },
    nobles: [
      {
        id: 1,
        backgroundImage: "url",
        point_value: 3,
        cost: {
          blue: 3,
          red: 3,
          black: 3
        }
      }
    ]
  },
  game_players: [
    {
      id: 1,
      avatarImage: "url",
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
    }
  ],
  current_player: {
    id: 2,
    avatarImage: "url",
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

require("./assets/stylesheets/screen.scss");

ReactDOM.render(
  <Game state={gameState}/>,
  document.getElementById('app')
);
