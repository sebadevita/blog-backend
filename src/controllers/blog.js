const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get("/", (request, response) => {
    Blog.find({}).then((blogs) => {
      response.json(blogs)
    })
  })
  
  blogsRouter.post("/", (request, response) => {
    const Blog = new Blog(request.body)
  
    Blog.save().then((result) => {
      response.status(201).json(result)
    })
  })

  module.exports = blogsRouter
