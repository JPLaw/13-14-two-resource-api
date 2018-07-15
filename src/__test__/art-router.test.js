'use strict';

import superagent from 'superagent';
import faker from 'faker';
import { startServer, stopServer } from '../lib/server';
import Museum from '../model/museum';
import Art from '../model/art';
import createMockDataPromise from './lib/artMock';

const apiUrl = `http://localhost:${process.env.PORT}/api/art`;

beforeAll(startServer);
afterAll(stopServer);

afterEach((done) => {
  Promise.all([
    Museum.remove({}),
    Art.remove({}),
  ]);
  done();
});

describe('POST /api/art', () => {
  test('200 POST for succcesful posting of an art piece', () => {
    return createMockDataPromise()
      .then((mockData) => {
        const mockArt = {
          title: faker.lorem.words(2),
          artistName: faker.lorem.words(2),
          museumId: mockData.theMuseum._id,
        };

        return superagent.post(apiUrl)
          .send(mockArt)
          .then((response) => {
            expect(response.status).toEqual(200);
          })
          .catch((err) => {
            throw err;
          });
      });
  });
  test('400 POST for bad request if no request body was provided', () => {
    return createMockDataPromise()
      .then((mockData) => {
        const mockArt = {
          title: faker.lorem.words(2),
          artistName: faker.lorem.words(2),
          museumId: mockData.theMuseum._id,
        };
        return superagent.post(apiUrl)
          .send(mockArt)
          .catch((error) => {
            expect(error.status).toEqual(400);
          });
      });
  });
});

describe('GET /api/art', () => {
  test('200 GET for succesful fetching of an art piece', () => {
    return createMockDataPromise()
      .then((mockData) => {
        return superagent.get(`${apiUrl}/${mockData.art._id}`);
      })
      .then((response) => {
        expect(response.status).toEqual(200);
      })
      .catch((err) => {
        throw err;
      });
  });

  test('404 GET: No art piece with this ID', () => {
    return createMockDataPromise()
      .then(() => {
        return superagent.get(`${apiUrl}/1234`)
          .catch((error) => {
            expect(error.status).toEqual(404);
          });
      });
  });


  describe('PUT request to /api/art', () => {
    test('200 PUT for succesful update of a resource', () => {
      return createMockDataPromise()
        .then((mockData) => {
          return superagent.put(`${apiUrl}/${mockData.art._id}`)
            .send({ title: 'updated title', artistName: 'updated name' })
            .then((response) => {
              expect(response.status).toEqual(200);
              expect(response.body.title).toEqual('updated title');
              expect(response.body.artistName).toEqual('updated name');
            })
            .catch((error) => {
              throw error;
            })
            .catch((error) => {
              throw error;
            });
        });
    });

    test('404 PUT: No art piece with this ID', () => {
      return createMockDataPromise()
        .then(() => {
          return superagent.put(`${apiUrl}/1234`)
            .catch((error) => {
              expect(error.status).toEqual(404);
            });
        });
    });

    test('400 PUT: No path', () => {
      return superagent.put(`${apiUrl}`)
        .then((response) => {
          throw response;
        })
        .catch((error) => {
          expect(error.status).toEqual(400);
        });
    });
  });
});
