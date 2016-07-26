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
