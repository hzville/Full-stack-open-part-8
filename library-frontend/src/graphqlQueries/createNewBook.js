import { gql } from '@apollo/client'

export const CREATE_NEW_BOOK = gql`
  mutation createNewBook($title: String!, $author: String!, $published: Int!, $genres: [String!]!) {
    addBook(
        title: $title,
        author: $author,
        published: $published,
        genres: $genres
    ) {
        title
        author {
          name
        }
        published
        genres
    }
  }
`