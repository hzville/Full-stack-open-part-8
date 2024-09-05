import { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'
import Notify from './components/Notify'
import Recommend from './components/Recommend'
import { useApolloClient, useSubscription } from '@apollo/client'
import { BOOK_ADDED } from './graphqlQueries/bookAddedSubscription'

const App = () => {
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(null)
  const [errorMessage, setErrormessage] = useState(null)
  const client = useApolloClient()

  const notify = (message) => {
    setErrormessage(message)
    setTimeout(() => {
      setErrormessage(null)
    }, 10000)
  }

  useSubscription(BOOK_ADDED, {
    onData: ({ data }) => {
      const book = data.data.bookAdded
      notify(`New book has been added, title: ${book.title} by following author: ${book.author.name} `)
    }
  })

  
  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
    setPage('authors')
  }

  return (
    <div>
      <div>
        <Notify errorMessage={errorMessage} />
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {!token && <button onClick={() => setPage('login')}>login</button>}
        {token && 
        <>
          <button onClick={() => setPage('add')}>add book</button>
          <button onClick={() => setPage('recommend')}>recommend</button>
          <button onClick={logout}>logout</button>
        </>
        }
        
      </div>

      <Authors show={page === 'authors'} token={token} />

      <Books show={page === 'books'} />

      <NewBook show={page === 'add'} setError={notify} />

      <Recommend show={page === 'recommend'} />

      <LoginForm show={page === 'login'} setPage={setPage} setToken={setToken} setError={notify} />
      
    </div>
  )
}

export default App
