const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
let books = require('./data/books')
let authors = require('./data/authors')
const { v1: uuid } = require('uuid')

const typeDefs = `
  type Book {
    title: String!
    published: Int!
    author: String!
    id: ID!
    genres: [String!]
  }

  type Author {
    name: String!
    born: Int
    id: ID!
    bookCount: Int
  }


  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]!
    ): Book
    editAuthor(
      name: String!
      setBornTo: Int!
    ): Author

  }
`

const resolvers = {
  Query: {
    bookCount: () => books.length,
    authorCount: () => authors.length,
    allBooks: (root, args) => {
      if (!args.author && !args.genre){
        return books
      }
      const authorFilter = args.author ? books.filter((book) => book.author == args.author) : books
      const genrefilter = args.genre ? authorFilter.filter((book) => book.genres.includes(args.genre)) : authorFilter
      return genrefilter
    },
    allAuthors: () => authors
  },
  Author: {
    bookCount: (root) => books.filter((book) => book.author == root.name).length
  },
  Mutation: {
    addBook: (root, args) => {
      const book = {...args, id: uuid()}
      books = books.concat(book)
      const authorPresent = authors.some(author => author.name.toLowerCase() == args.author.toLowerCase())
      if (!authorPresent) {
        const newAuthor = {name: args.author, id: uuid()}
        authors = authors.concat(newAuthor)
      }
      return book
    },
    editAuthor: (root, args) => {
      const author = authors.find(author => author.name.toLowerCase() === args.name.toLowerCase())
      if (!author) {
        return null
      }
      const updateAuthor = { ...author, born: args.setBornTo}
      authors = authors.map(author => author.name === args.name ? updateAuthor : author)
      return updateAuthor
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

startStandaloneServer(server, {
  listen: { port: 4000 },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})