const initialState = null

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_USER':
            return action.data
        case 'CLEAR_USER':
            return initialState
        default:
            return state
    }
}

export const setUser = (user) => ({
    type: 'SET_USER',
    data: user,
})

export const clearUser = () => ({
    type: 'CLEAR_USER',
})

export default userReducer