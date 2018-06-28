'use strict';

import faker from 'faker';
import Museum from '../../model/museum';

export default () => {
  const mockResouceToPost = {
    name: faker.lorem.words(2),
  };
  return new Museum(mockResouceToPost).save();
};
