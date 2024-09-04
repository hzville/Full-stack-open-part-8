const { ApolloServer } = require("@apollo/server")
const { startStandaloneServer } = require("@apollo/server/standalone")
const typeDefs = require('./apolloTypeDefs')
const resolvers = require('./apolloResolvers')

const startApolloServer = () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers
  })

  console.log('Starting Apollo Server')
  startStandaloneServer(server, {
    listen: { port: 4000 },
  }).then(({ url }) => {
    console.log(`Apollo Server ready at ${url}`)
  })
}

module.exports = startApolloServer