'use strict';

import superagent from 'superagent';
import faker from 'faker';
import { startServer, stopServer } from '../lib/server';
import Museum from '../model/museum';
import createMockMuseumPromise from './lib/museumMock';

const apiUrl = `http://localhost:${process.env.PORT}/api/museum`;

beforeAll(startServer);
afterAll(stopServer);
afterEach(() => Museum.remove({}));

describe('POST /api/museum', () => {
  const mockResource = {
    name: faker.lorem.words(2),
    location: faker.lorem.words(2),
  };

  test('200 POST for successful post of a museum', () => {
    return superagent.post(apiUrl)
      .send(mockResource)
      .then((response) => {
        expect(response.status).toEqual(200);
        expect(response.body.name).toEqual(mockResource.name);
        expect(response.body._id).toBeTruthy();
      })
      .catch((err) => {
        throw err;
      });
  });

  test('POST 400 for bad request if no request body was provided', () => {
    return superagent.post(apiUrl)
      .then((response) => {
        throw response;
      })
      .catch((err) => {
        expect(err.status).toEqual(400);
      });
  });

  describe('GET /api/museum', () => {
    test('200 GET for successful fetching of a museum', () => {
      let returnedMuseum;
      return createMockMuseumPromise()
        .then((newMuseum) => {
          returnedMuseum = newMuseum;
          return superagent.get(`${apiUrl}/${newMuseum._id}`);
        })
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(response.body.name).toEqual(returnedMuseum.name);
        })
        .catch((err) => {
          throw err;
        });
    });
    
    test('404 GET for valid request made with an id that was not found', () => {
      return superagent.get(`${apiUrl}/"1234"`)
        .then((response) => {
          throw response;
        })
        .catch((err) => {
          expect(err.status).toBe(404);
        });
    });
  });

  describe('PUT /api/museum', () => {
    const mockMuseumForUpdate = {
      name: 'MoMA',
      location: 'San Francisco',
    };
  
    test('200 PUT for successful update of a resource', () => {
      let returnedMuseum;
      return createMockMuseumPromise()
        .then((newMuseum) => {
          returnedMuseum = newMuseum;
          return superagent.put(`${apiUrl}/${newMuseum._id}`)
            .send(mockMuseumForUpdate);
        })
        .then((response) => {
          expect(response.status).toBe(200);
          expect(response.body._id.toString()).toBe(returnedMuseum._id.toString());
          expect(response.body.name).toBe(mockMuseumForUpdate.name);
          expect(response.body.location).toBe(response.body.location);
        })
        .catch((err) => {
          throw err;
        });
    });
    test('400 PUT if no request body was provided', () => {
      return createMockMuseumPromise()
        .then((newMuseum) => {
          return superagent.put(`${apiUrl}/${newMuseum._id}`)
            .then((response) => {
              throw response;
            })
            .catch((err) => {
              expect(err.status).toBe(400);
            });
        });
    });
  
    test('404 PUT for valid request made with an id that was not found', () => {
  
    });
  });
});
