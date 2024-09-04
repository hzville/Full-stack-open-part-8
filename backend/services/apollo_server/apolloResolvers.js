const Author = require('../../models/authorSchema')
const Book = require('../../models/bookSchema')
const { GraphQLError } = require('graphql')

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
    allAuthors: async () => Author.find({})
  },
  Author: {
    bookCount: async (root) => (await Book.find({author: root.id})).length
  },
  Mutation: {
    addBook: async (root, args) => {
      const book = new Book({...args})
      const authorPresent = await Author.findOne({ name: args.author })
      try {
        if (authorPresent != null) {
          book.author = authorPresent
          return await book.save()
        } else {
          book.author = await new Author({name: args.author}).save()
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
    editAuthor: async (root, args) => {
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
    }
  }
}

module.exports = resolvers
