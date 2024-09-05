import { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'
import Notify from './components/Notify'
import { useApolloClient } from '@apollo/client'

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
  
  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
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
          <button onClick={logout}>logout</button>
        </>
        }
        
      </div>

      <Authors show={page === 'authors'} token={token} />

      <Books show={page === 'books'} />

      <NewBook show={page === 'add'} setError={notify} />

      <LoginForm show={page === 'login'} setPage={setPage} setToken={setToken} setError={notify} />
      
    </div>
  )
}

export default App
