const startMongooseConnection = require('./services/mongoDB/mongoose')
const startApolloServer = require('./services/apollo_server/apolloServer')

startMongooseConnection()
startApolloServer()

