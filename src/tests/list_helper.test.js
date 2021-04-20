const listHelper = require('../utils/list_helper')

const listWithOneBlog = [
  {
    id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url:
      'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5
  }
]

const listWithManyBlogs = [
  {
    id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url:
      'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5
  },
  {
    id: '5a422aa71b54a676234d17f9',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url:
      'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 2
  },
  {
    id: '5a422aa71b54a676234d17f7',
    title: 'Go To Statement Considered Harmful',
    author: 'Seba Dev',
    url:
      'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 0
  }
]
describe('dummy', () => {
  test('returns one', () => {
    const blogs = []

    const result = listHelper.dummy(blogs)
    expect(result).toBe(1)
  })
})

describe('total likes', () => {
  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    expect(result).toBe(5)
  })

  test('of empty list is zero', () => {
    const result = listHelper.totalLikes([])
    expect(result).toBe(0)
  })

  test('of a bigger list is calculated right', () => {
    const result = listHelper.totalLikes(listWithManyBlogs)
    expect(result).toBe(7)
  })
})

describe('favourite blog', () => {
  test('when have a list with many blogs the favourite is the one with more likes', () => {
    const result = listHelper.favouriteBlog(listWithManyBlogs)
    expect(result).toStrictEqual({
      id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url:
          'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5
    })
  })

  test('when have a list with one blog the favourite is the unique blog', () => {
    const result = listHelper.favouriteBlog(listWithOneBlog)
    expect(result).toStrictEqual({
      id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url:
            'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5
    })
  })

  test('when have an empty list the result is zero', () => {
    const result = listHelper.favouriteBlog([])
    expect(result).toBe(0)
  })

  describe('Most blogs', () => {
    test('when have a list with one blog the top author is the unique author', () => {
      const result = listHelper.mostBlogs(listWithManyBlogs)
      expect(result).toStrictEqual({
        author: 'Edsger W. Dijkstra',
        blogs: 2
      })
    })

    test('when have a list with many blogs the top author is the one who write more', () => {
      const result = listHelper.mostBlogs(listWithManyBlogs)
      expect(result).toStrictEqual({
        author: 'Edsger W. Dijkstra',
        blogs: 2
      })
    })

    test('when receive an empty list, you get an error message', () => {
      const result = listHelper.mostBlogs([])
      expect(result).toBe('Blogs is empty')
    })
  })
})
