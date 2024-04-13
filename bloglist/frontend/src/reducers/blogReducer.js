const initialState = []

const blogReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'INIT_BLOGS':
            return action.data
        case 'CREATE_BLOG':
            return state.concat(action.data)
        case 'LIKE_BLOG':
            return state.map((blog) =>
                blog.id === action.data.id ? action.data : blog
            )
        case 'REMOVE_BLOG':
            return state.filter((blog) => blog.id !== action.data.id)
        default:
            return state
    }
}

export const initBlogs = (blogs) => ({
    type: 'INIT_BLOGS',
    data: blogs,
})

export const createBlog = (blog) => ({
    type: 'CREATE_BLOG',
    data: blog,
})

export const likeBlog = (blog) => ({
    type: 'LIKE_BLOG',
    data: blog,
})

export const removeBlog = (blog) => ({
    type: 'REMOVE_BLOG',
    data: blog,
})

export default blogReducer