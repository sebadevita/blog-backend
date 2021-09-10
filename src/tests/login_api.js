// const supertest = require('supertest')
// const mongoose = require('mongoose')
// const app = require('../../app')
// const User = require('../models/user')
// const bcrypt = require('bcrypt')

// const api = supertest(app)

// describe.skip('login user', () => {
//   let user1

//   beforeEach(async () => {
//     const initialUsers = [
//       {
//         username: 'sebita',
//         passwordHash: await bcrypt.hash('banana123', 10)
//       },
//       {
//         username: 'andylarquy',
//         passwordHash: await bcrypt.hash('mandarina123', 10)
//       }
//     ]

//     await User.deleteMany({})
//     user1 = new User(initialUsers[0])
//     await user1.save()
//     const user2 = new User(initialUsers[1])
//     await user2.save()
//   })
//   test('return the token', async () => {
//     const user = {
//       username: 'sebita',
//       password: 'banana123'
//     }

//     const response = await api
//       .post('/api/login')
//       .send(user)
//       .expect(200)
//       .expect('Content-Type', /application\/json/)

//     expect(response.body.token).toBeDefined()
//     console.log(user1)
//   })
// })

// afterEach(() => {
//   mongoose.connection.close()
// })
