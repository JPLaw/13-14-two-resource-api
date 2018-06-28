import faker from 'faker';
import Art from '../../model/art';
import museumMockPromise from './museumMock';

export default () => {
  const mockData = {};
  return museumMockPromise()
    .then((newMuseum) => {
      mockData.theMuseum = newMuseum;
      /*
      mockData = {
        classRoom: {
          _id: 1342342354235235,
          name: some random words
        }
      }
      */
    })
    .then(() => {
      const mockArt = {
        title: faker.lorem.words(2),
        artistFirstName: faker.name.FirstName(),
        artistLastName: faker.name.LastName(),
        theMuseumId: mockData.theMuseum._id,
      };
      return new Art(mockArt).save();
    })
    .then((newArt) => {
      mockData.art = newArt;
      return mockData;
    })
    .catch((err) => {
      throw err;
    });
};
