import { gql } from '@apollo/client'

export const EDIT_AUTHOR = gql`
    mutation editAuthor($name: String!, $year: Int!) {
        editAuthor(
            name: $name,
            setBornTo: $year
        ) {
            name
            born
        }
    }
`