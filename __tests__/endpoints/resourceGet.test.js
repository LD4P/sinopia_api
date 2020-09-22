import connect from 'mongo.js'
import request from 'supertest'
import app from 'app.js'
const resource = require('../__fixtures__/resource_6852a770-2961-4836-a833-0b21a9b68041.json')
const resBody = require('../__fixtures__/resp_6852a770-2961-4836-a833-0b21a9b68041.json')
const allResBody = require('../__fixtures__/all_resp.json')

// To avoid race conditions with mocking connect, testing of resources is split into
// Multiple files.

jest.mock('mongo.js')

// GET all resources
describe('GET /resource/', () => {

  it('returns the first 25 resources', async () => {
    const mockEvery = jest.fn().mockImplementationOnce((callback) => {
      callback(resource)
      return Promise.resolve()
    })
    const mockFind = jest.fn().mockReturnValue({each: mockEvery})
    const mockCollection = (collectionName) => {
      return {
        resources: {find: mockFind}
      }[collectionName]
    }
    const mockDb = {collection: mockCollection}
    connect.mockReturnValue(mockDb)

    const res = await request(app)
      .get('/resource/')
      .set('Accept', 'application/json')
    expect(res.statusCode).toEqual(200)
    expect(res.body).toEqual(allResBody)
  })
})

// GET a single resource
describe('GET /resource/:resourceId', () => {
  it('returns the resource', async () => {
    const mockFindOne = jest.fn().mockResolvedValue(resource)
    const mockCollection = (collectionName) => {
      return {
        resources: {findOne: mockFindOne}
      }[collectionName]
    }
    const mockDb = {collection: mockCollection}
    connect.mockReturnValue(mockDb)

    const res = await request(app)
      .get('/resource/6852a770-2961-4836-a833-0b21a9b68041')
      .set('Accept', 'application/json')
    expect(res.statusCode).toEqual(200)
    expect(res.body).toEqual(resBody)
    expect(mockFindOne).toHaveBeenCalledWith({id: '6852a770-2961-4836-a833-0b21a9b68041'})
  })
})
