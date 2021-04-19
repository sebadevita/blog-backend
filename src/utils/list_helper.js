const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => blogs.reduce((acc, blog) => acc + blog.likes, 0)

const favouriteBlog = (blogs) => {
  // Usando reduce

  return blogs.length === 0
    ? 0
    : blogs.reduce((prevBlog, blog) =>
      prevBlog.likes > blog.likes
        ? prevBlog
        : blog)

  // Otra forma
  // const likes = blogs.map(blog => blog.likes)
  // const max = Math.max.apply(Math, likes)
  // const favourite = blogs.find(blog => blog.likes === max)
  // return favourite
}

module.exports = {
  dummy,
  totalLikes,
  favouriteBlog
}
