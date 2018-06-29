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
        expect(response.body.title).toEqual(mockResource.title);
        expect(response.body.location).toEqual(mockResource.location);
        expect(response.body._id).toBeTruthy();
      })
      .catch((err) => {
        throw err;
      });
  });

  test('POST 400 for not sending in a required NAME property', () => {
    const mockMuseumToPost = {
      name: faker.lorem.words(2),
    };
    return superagent.post(apiUrl)
      .send(mockMuseumToPost)
      .then((response) => {
        throw response;
      })
      .catch((err) => {
        expect(err.status).toEqual(400);
      });
  });

  test('POST 409 for a duplicate key', () => {
    return createMockMuseumPromise()
      .then((newMuseum) => {
        return superagent.post(apiUrl)
          .send({ name: newMuseum.name })
          .then((response) => {
            throw response;
          })
          .catch((err) => {
            expect(err.status).toEqual(409);
          });
      })
      .catch((err) => {
        throw err;
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
          expect(response.body.title).toEqual(returnedMuseum.title);
          expect(response.body.artistFirstName).toEqual(returnedMuseum.artistFirstName);
          expect(response.body.artistLastName).toEqual(returnedMuseum.artistLastName);
        })
        .catch((err) => {
          throw err;
        });
    });
  });
});
