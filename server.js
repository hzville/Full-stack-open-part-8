const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const books = require('./data/books')
const authors = require('./data/authors')

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
    allBooks(author: String): [Book!]!
    allAuthors: [Author!]!
  }
`

const resolvers = {
  Query: {
    bookCount: () => books.length,
    authorCount: () => authors.length,
    allBooks: (root, args) => !args.author ? books: booksFound = books.filter((book) => book.author == args.author),
    allAuthors: () => authors
  },
  Author: {
    bookCount: (root) => books.filter((book) => book.author == root.name).length
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