import { useQuery } from "@apollo/client"
import { ME } from '../graphqlQueries/meQuery'
import { ALL_BOOKS } from "../graphqlQueries/allBooksQuery"

const Recommend = ({show}) => {

  const favoriteGenreQuery = useQuery(ME, {
    pollInterval: 2000
  })
  const allBooksQuery = useQuery(ALL_BOOKS, {
    pollInterval: 2000
  })
  if (favoriteGenreQuery.loading) return <div>Loading view...</div>
  
  if (!show) {
    return null
  }

  const userData = favoriteGenreQuery.data.me
  const filteredBooks = allBooksQuery.data.allBooks.filter(book => book.genres.includes(userData.favoriteGenre))

  return(
    <div>
      <h3>Recommendations</h3>
      <div>Books in you favorite genre <b>{userData.favoriteGenre}</b></div>
      <table>
        <tbody>
          <tr>
            <th>title</th>
            <th>author</th>
            <th>published</th>
          </tr>
          {filteredBooks.map((book) => (
            <tr key={book.title}>
              <td>{book.title}</td>
              <td>{book.author.name}</td>
              <td>{book.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Recommend