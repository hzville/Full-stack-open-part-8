const mongoose = require('mongoose')
require('dotenv').config()

mongoose.set('strictQuery', false)
console.log('Starting connection to MongoDB')

const startMongooseConnection = () => {
  mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Successful MongoDB connection!')
  })
  .catch(error => {
    console.log('Error connecting to MongoDB', error.message)
  })}

module.exports = startMongooseConnection