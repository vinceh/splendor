import { hashHistory } from 'react-router'

export function get_game(game_id) {
  return (dispatch) => {
    return fetch_get(`${API_URL}/games/${game_id}`)
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
      `${API_URL}/new_game`,
      {
        user_ids: players
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
    return fetch_post(
      `${API_URL}/games/${game_id}/submit_pick_gems`, params)
      .then(response => response.json())
      .then(json => {
        dispatch({
          type: 'GET_GAME',
          game_data: json.gameState
        })
      })
  }
}

export function submit_reserve_card(game_id, params) {
  return (dispatch) => {
    return fetch_post(
      `${API_URL}/games/${game_id}/submit_reserve_card`, params)
      .then(response => response.json())
      .then(json => {
        dispatch({
          type: 'GET_GAME',
          game_data: json.gameState
        })
      })
  }
}

export function submit_buy_card(game_id, params) {
  return (dispatch) => {
    return fetch_post(
      `${API_URL}/games/${game_id}/submit_buy_card`, params)
      .then(response => response.json())
      .then(json => {
        dispatch({
          type: 'GET_GAME',
          game_data: json.gameState
        })
      })
  }
}

export function get_users() {
  return (dispatch) => {
    return fetch_get(`${API_URL}/all_users`)
      .then(response => response.json())
      .then(json => {
        dispatch({
          type: 'GET_USERS',
          users: json
        })
      })
  }
}

export function get_games() {
  return (dispatch) => {
    return fetch_get(`${API_URL}/my_games`)
      .then(response => response.json())
      .then(json => {
      console.log(json)
        // dispatch({
        //   type: 'GET_GAMES',
        //   games: json
        // })
      })
  }
}

export function get_profile() {
  return (dispatch) => {
    return fetch_get(`${API_URL}/profile`)
      .then(response => response.json())
      .then(json => {
        console.log(json.users)
        dispatch({
          type: 'GET_PROFILE',
          games: json.games,
          users: json.users,
          my_profile: json.my_profile
        })
      })
  }
}

function fetch_get(url) {
  return fetch(`${url}?token=${window.localStorage.getItem('token')}`)
}

function fetch_post(url, body) {
  return fetch(`${url}?token=${window.localStorage.getItem('token')}`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })
}
