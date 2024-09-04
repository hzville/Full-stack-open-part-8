let books = require('../../data/books')
let authors = require('../../data/authors')
const Author = require('../../models/authorSchema')
const Book = require('../../models/bookSchema')

const resolvers = {
  Query: {
    bookCount: () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      if (!args.author && !args.genre){
        return Book.find({}).populate('author')
      }
      const authorFilter = args.author ? books.filter((book) => book.author == args.author) : books
      const genrefilter = args.genre ? authorFilter.filter((book) => book.genres.includes(args.genre)) : authorFilter
      return genrefilter
    },
    allAuthors: async () => Author.find({})
  },
  Author: {
    bookCount: (root) => books.filter((book) => book.author == root.name).length
  },
  Mutation: {
    addBook: async (root, args) => {
      const book = new Book({...args})
      const authorPresent = await Author.findOne({ name: args.author })
      if (authorPresent != null) {
        book.author = authorPresent
        return await book.save()
      } else {
        book.author = await new Author({name: args.author}).save()
        return await book.save()
      }
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

module.exports = resolvers
