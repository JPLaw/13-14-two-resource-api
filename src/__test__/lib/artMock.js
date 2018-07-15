import faker from 'faker';
import Art from '../../model/art';
import museumMockPromise from './museumMock';

export default () => {
  const mockData = {};
  return museumMockPromise()
    .then((newMuseum) => {
      mockData.theMuseum = newMuseum;
    })
    .then(() => {
      const mockArt = {
        title: faker.lorem.words(2),
        artistName: faker.lorem.words(2),
        museumId: mockData.theMuseum._id,
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
