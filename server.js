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


  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks: [Book!]!
  }
`

const resolvers = {
  Query: {
    bookCount: () => books.length,
    authorCount: () => authors.length,
    allBooks: () => books
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