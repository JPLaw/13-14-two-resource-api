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
    title: faker.lorem.words(2),
    artistFirstName: faker.name.firstName(),
    artistLastName: faker.name.lastName(),
  };

  test('200 POST for successful post of a museum', () => {
    return superagent.post(apiUrl)
      .send(mockResource)
      .then((response) => {
        expect(response.status).toEqual(200);
        expect(response.body.title).toEqual(mockResource.title);
        expect(response.body.artistFirstName).toEqual(mockResource.artistFirstName);
        expect(response.body.artistLastName).toEqual(mockResource.artistLastName);
        expect(response.body._id).toBeTruthy();
      })
      .catch((err) => {
        throw err;
      });
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
