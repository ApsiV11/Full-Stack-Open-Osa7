const initialState = null

const notificationReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_NOTIFICATION':
            return action.data
        case 'CLEAR_NOTIFICATION':
            return initialState
        default:
            return state
    }
}

export const setNotification = (message, type = 'success') => ({
    type: 'SET_NOTIFICATION',
    data: { message, type },
})

export const clearNotification = () => ({
    type: 'CLEAR_NOTIFICATION',
})

export default notificationReducer