import { gql } from '@apollo/client'

export const BOOK_ADDED = gql`
subscription Subscription {
  bookAdded {
    title
    published
    id
    genres
    author {
      name
      id
      born
      bookCount
    }
  }
}
`