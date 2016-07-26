import { hashHistory } from 'react-router'

export function get_game(game_id) {
  console.log('getting game')
  return (dispatch) => {
    return fetch(`http://localhost:3001/games/${game_id}`)
      .then(response => response.json())
      .then(json => {
        dispatch({
          type: 'GET_GAME',
          game_data: json.gameState
        })
      })
  }
}

export function new_game(players) {
  return (dispatch) => {
    return fetch_post(
      'http://localhost:3001/new_game',
      {
        user_ids: [
          1,
          2,
          3,
          4
        ]
      })
      .then(response => response.json())
      .then(json => {
        dispatch({
          type: 'NEW_GAME',
          game_data: json.gameState
        })
        return json.id
      })
      .then(game_id => {
        hashHistory.push(`/game/${game_id}`)
      })
  }
}

export function submit_turn() {
  return {
    type: 'SUBMIT_TURN'
  }
}

export function submit_pick_gems(game_id, params) {
  return (dispatch) => {
    console.log('action called', game_id, params)
    return fetch_post(
      `http://localhost:3001/games/${game_id}/submit_pick_gems`, params)
      .then(response => response.json())
      .then(json => {
        console.log('shit returned', json)
        dispatch({
          type: 'GET_GAME',
          game_data: json.gameState
        })
      })
  }
}

function fetch_post(url, body) {
  return fetch(url, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })
}
