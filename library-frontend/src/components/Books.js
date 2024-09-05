import { useQuery } from '@apollo/client'
import { ALL_BOOKS } from '../graphqlQueries/allBooksQuery'
import { useState } from 'react'

const Books = (props) => {
  
  const booksQuery = useQuery(ALL_BOOKS, {
    pollInterval: 2000
  })
  const [genre, setGenre] = useState(null)


  if (!props.show) {
    return null
  }

  if (booksQuery.loading) return <div>Loading view...</div>

  const booksData = booksQuery.data.allBooks
  const listOfGenres = [...new Set(booksData.map(book => book.genres).flat())]
  const listToShow = genre ? booksData.filter(book => book.genres.includes(genre)) : booksData

  return (
    <div>
      <h2>books</h2>
      {genre && <div>Books in genre {genre}</div>}
      <table>
        <tbody>
          <tr>
            <th>title</th>
            <th>author</th>
            <th>published</th>
          </tr>
          {listToShow.map((book) => (
            <tr key={book.title}>
              <td>{book.title}</td>
              <td>{book.author.name}</td>
              <td>{book.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {listOfGenres.map(genre => (
        <button key={genre} onClick={() => setGenre(genre)}>{genre}</button>
      ))}
      <button onClick={() => setGenre(null)}>all genres</button>
    </div>
  )
}

export default Books
