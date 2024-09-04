const { ApolloServer } = require("@apollo/server")
const { startStandaloneServer } = require("@apollo/server/standalone")
const typeDefs = require('./apolloTypeDefs')
const resolvers = require('./apolloResolvers')
const jwt = require('jsonwebtoken')
const User = require('../../models/userSchema')

const startApolloServer = () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers
  })

  console.log('Starting Apollo Server')
  startStandaloneServer(server, {
    listen: { port: 4000 },
    context: async ({req, res}) => {
      const auth = req ? req.headers.authorization : null
      if (auth && auth.startsWith('Bearer ')) {
        const decodedToken = jwt.verify(auth.substring(7), process.env.JWT_SECRET)
        const currentUser = await User.findById(decodedToken.id)
        return {currentUser}
      }
    }
  }).then(({ url }) => {
    console.log(`Apollo Server ready at ${url}`)
  })
}

module.exports = startApolloServer