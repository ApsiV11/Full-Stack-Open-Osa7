import { useState, useEffect, createRef } from 'react'

import blogService from './services/blogs'
import loginService from './services/login'
import storage from './services/storage'
import Login from './components/Login'
import Blog from './components/Blog'
import NewBlog from './components/NewBlog'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import { useDispatch, useSelector } from 'react-redux'
import { setNotification, clearNotification } from './reducers/notificationReducer'
import { initBlogs, createBlog, likeBlog, removeBlog } from './reducers/blogReducer'
import { setUser, clearUser } from './reducers/userReducer'

const App = () => {
    const blogs = useSelector((state) => state.blogs)
    const user = useSelector((state) => state.user)
    const notification = useSelector((state) => state.notification)
    const dispatch = useDispatch()

    useEffect(() => {
        blogService.getAll().then((blogs) => dispatch(initBlogs(blogs)))
    }, [])

    useEffect(() => {
        const user = storage.loadUser()
        if (user) {
            dispatch(setUser(user))
        }
    }, [])

    const blogFormRef = createRef()

    const notify = (message, type = 'success') => {
        dispatch(setNotification(message, type))
        setTimeout(() => {
            dispatch(clearNotification())
        }, 5000)
    }

    const handleLogin = async (credentials) => {
        try {
            const user = await loginService.login(credentials)
            dispatch(setUser(user))
            storage.saveUser(user)
            notify(`Welcome back, ${user.name}`)
        } catch (error) {
            notify('Wrong credentials', 'error')
        }
    }

    const handleCreate = async (blog) => {
        const newBlog = await blogService.create(blog)
        dispatch(createBlog(newBlog))
        notify(`Blog created: ${newBlog.title}, ${newBlog.author}`)
        blogFormRef.current.toggleVisibility()
    }

    const handleVote = async (blog) => {
        console.log('updating', blog)
        const updatedBlog = await blogService.update(blog.id, {
            ...blog,
            likes: blog.likes + 1,
        })

        notify(`You liked ${updatedBlog.title} by ${updatedBlog.author}`)
        dispatch(likeBlog(updatedBlog))
    }

    const handleLogout = () => {
        dispatch(clearUser())
        storage.removeUser()
        notify(`Bye, ${user.name}!`)
    }

    const handleDelete = async (blog) => {
        if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
            await blogService.remove(blog.id)
            dispatch(removeBlog(blog))
            notify(`Blog ${blog.title}, by ${blog.author} removed`)
        }
    }

    if (!user) {
        return (
            <div>
                <h2>blogs</h2>
                <Notification notification={notification} />
                <Login doLogin={handleLogin} />
            </div>
        )
    }

    const byLikes = (a, b) => b.likes - a.likes

    return (
        <div>
            <h2>blogs</h2>
            <Notification notification={notification} />
            <div>
                {user.name} logged in
                <button onClick={handleLogout}>logout</button>
            </div>
            <Togglable buttonLabel="create new blog" ref={blogFormRef}>
                <NewBlog doCreate={handleCreate} />
            </Togglable>
            {blogs.sort(byLikes).map((blog) => (
                <Blog
                    key={blog.id}
                    blog={blog}
                    handleVote={handleVote}
                    handleDelete={handleDelete}
                />
            ))}
        </div>
    )
}

export default App
