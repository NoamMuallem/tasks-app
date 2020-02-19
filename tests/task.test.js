const request = require('supertest')
const app = require('../src/app')
const Task = require('../src/models/task')
const { userOne, userTwo, taskOne, taskTwo, taskThree, setupDatabase } = require('./fixtures/db')

beforeEach(setupDatabase)

test('should creat a task for user', async () => {
    const response = await request(app).
        post('/tasks').
        set('Authorization', `Bearer ${userOne.tokens[0].token}`).
        send({
            description: 'from my tast'
        })
        .expect(201)

    const task = await Task.findById(response.body._id)
    expect(task).not.toBeNull()
    expect(task.completed).toEqual(false)
})

test('should fetch user tasks', async () => {
    const response = await request(app).
        get('/tasks').
        set('Authorization', `Bearer ${userOne.tokens[0].token}`).
        expect(200)

    expect(response.body.length).toBe(2)
})

test('should not delet other users tasks', async () => {
    const response = await request(app).
        delete(`/tasks/${taskOne._id}`).
        set('Authorization', `Bearer ${userTwo.tokens[0].token}`).
        expect(404) //unauthorized!

    //making sur the task is still on the db
    const task = await Task.findById(`${taskOne._id}`)
    expect(task).not.toBeNull()
})