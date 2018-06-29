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
afterEach(() => {
  Promise.all([
    Museum.remove({}),
    Art.remove({}),
  ]);
});

describe('POST /api/art', () => {
  test('200 POST for succcesful posting of an art piece', () => {
    return createMockDataPromise()
      .then((mockData) => {
        const mockArt = {
          title: faker.lorem.words(2),
          artistName: faker.lorem.words(2),
          artId: mockData.art._id,
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
    return superagent.post(apiUrl)
      .then((response) => {
        throw response;
      })
      .catch((err) => {
        expect(err.status).toBe(400);
      });
  });
});

describe('GET /api/art', () => {
  test('200 GET for succesful fetching of an art piece', () => {
    let returnedArt;
    return createMockDataPromise()
      .then((mockData) => {
        return superagent.get(`${apiUrl}/${mockData.art._id}`);
      })
      .then((response) => {
        expect(response.status).toEqual(200);
        expect(response.body.title).toEqual(returnedArt.title);
        expect(response.body.artistName).toEqual(returnedArt.artistName);
        expect(response.body.medium).toEqual(returnedArt.medium);
      })
      .catch((err) => {
        throw err;
      });
  });

  test('404 GET: No art piece with this ID', () => {
    return superagent.get(`${apiUrl}/1234`)
      .then((results) => {
        throw results;
      })
      .catch((error) => {
        expect(error.status).toEqual(404);
      });
  });
});


describe('PUT request to api/art', () => {
  const mockArtForUpdate = {
    title: 'Starry Night',
    artistName: 'Vincent VanGough',
  };


  test('200 PUT for succesful update of a resource', () => {
    // let returnedArt;
    return createMockDataPromise()
      .then((mockData) => {
        returnedArt = mockData.art;
        return superagent.put(`${apiUrl}/${mockData.art._id}`)
          .send(mockArtForUpdate);
      })
      .then((response) => {
        expect(response.status).toEqual(200);
        expect(response.body.name).toEqual(mockArtForUpdate.title);
        expect(response.body.location).toEqual(mockArtForUpdate.artistName);
      })
      .catch((error) => {
        throw error;
      });
  });
});

test('400 PUT if no request body was provided', () => {
  let returnedArt;
  return createMockDataPromise()
    .then((mockData) => {
      returnedArt = mockData.art;
      return superagent.put(`${apiUrl}/${mockData.art._id}`);
    })
    .then((reponse) => {
      throw reponse;
    })
    .catch((error) => {
      expect(error.status).toEqual(400);
    });
});

test('404 PUT: No art piece with this ID', () => {
  return superagent.put(`${apiUrl}/1234`)
    .send(mockArtForUpdate)
    .then((response) => {
      throw response;
    })
    .catch((error) => {
      expect(error.status).toEqual(404);
    });
});

