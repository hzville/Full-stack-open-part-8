const Author = require('../../models/authorSchema')
const Book = require('../../models/bookSchema')
const User = require('../../models/userSchema')
const { GraphQLError } = require('graphql')
const jwt = require('jsonwebtoken')
const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()


const resolvers = {
  Query: {
    bookCount: () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      if (!args.author && !args.genre){
        return Book.find({}).populate('author')
      }
      if (args.genre) {
        return await Book.find({genres: {$in: args.genre}}).populate('author')
      }
    },
    allAuthors: async () => Author.find({}),
    me: (root, args, context) => {
      return context.currentUser
    }
  },
  Author: {
    bookCount: async (root) => (await Book.find({author: root.id})).length
  },
  Mutation: {
    addBook: async (root, args, context) => {
      const currentUser = context.currentUser
      if (!currentUser) {
        throw new GraphQLError('Please log in to add book', {
          extensions: {
            code: 'BAD_USER_INPUT',
          }
        })
      }
      const book = new Book({...args})
      const authorPresent = await Author.findOne({ name: args.author })
      try {
        if (authorPresent != null) {
          book.author = authorPresent
          pubsub.publish('BOOK_ADDED', { bookAdded: book })
          return await book.save()
        } else {
          book.author = await new Author({name: args.author}).save()
          pubsub.publish('BOOK_ADDED', { bookAdded: book })
          return await book.save()
        }
      } catch (error) {
        throw new GraphQLError('Adding new book failed',{
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: [args.title, args.author],
            error
          }
        })
      }
    },
    editAuthor: async (root, args, context) => {
    const currentUser = context.currentUser
    if (!currentUser) {
        throw new GraphQLError('Please log in to edit author', {
          extensions: {
            code: 'BAD_USER_INPUT',
          }
        })
      }
      let author = await Author.findOne({name: args.name})
      if (!author){
        return null
      }
      author.born = args.setBornTo
      try {
        return await author.save()
      } catch (error){
        throw new GraphQLError('Editing author failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
            error
          }
        })
      }
    },
    createUser: async (root, args) => {
      const user = new User({...args})
      try {
        return user.save()
      } catch (error) {
          throw new GraphQLError('Creating new user failed', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: [args.username, args.favoriteGenre],
              error
            }
          })
      }
    },
    login: async (root, args) => {
      const user = await User.findOne({username: args.username })

      if (!user || args.password !== 'password') {
        throw new GraphQLError('Login failed, check username/password', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })
      }
      const userForToken = {
        username: user.username,
        id: user._id
      }
      return {value: jwt.sign(userForToken, process.env.JWT_SECRET)}
    }
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator('BOOK_ADDED')
    }
  }
}

module.exports = resolvers
