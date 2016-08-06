export function game(state = {fetching: true}, action) {
  switch (action.type) {
    case 'NEW_GAME':
      return action.game_data
    case 'GET_GAME':
      // console.log('get game got called')
      return action.game_data
    default:
      return state
  }
}

export function home(state = {fetching: true}, action) {
  switch (action.type) {
    case 'GET_USERS':
      return {
        users: action.users
      }
    case 'GET_GETS':
      return {
        games: action.games
      }
    case 'GET_PROFILE':
      return {
        games: action.games,
        users: action.users,
        my_profile: action.my_profile
      }
    default:
      return state
  }
}
