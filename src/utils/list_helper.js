const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => blogs.reduce((acc, blog) => acc + blog.likes, 0)

const favouriteBlog = (blogs) => {
  // Usando reduce

  return blogs.length === 0
    ? 0
    : blogs.reduce((prevBlog, blog) =>
      prevBlog.likes > blog.likes ? prevBlog : blog
    )

  // Another way
  // const likes = blogs.map(blog => blog.likes)
  // const max = Math.max.apply(Math, likes)
  // const favourite = blogs.find(blog => blog.likes === max)
  // return favourite
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return 'Blogs is empty'
  } else {
    const topAuthor =
    _.chain(blogs)
      .groupBy('author')
      .map((group, author) => {
        return {
          author: author,
          blogs: group.length
        }
      })
      .maxBy((object) => object.blogs)
      .value()

    return topAuthor
  }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return 'Blogs is empty'
  } else {
    const topAuthor = _.chain(blogs)
      .groupBy('author')
      .map((group, author) => {
        return {
          author: author,
          likes: group.reduce((acc, next) => {
            return (acc += next.likes)
          }, 0)
        }
      })
      .maxBy((object) => object.likes)
      .value()

    return topAuthor
  }
}

module.exports = {
  dummy,
  totalLikes,
  favouriteBlog,
  mostBlogs,
  mostLikes
}
