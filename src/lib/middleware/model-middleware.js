'use strict';

import HttpErrors from 'http-errors';
import modelMapPromise from '../../model';
import logger from '../logger';

export default (request, response, next) => {
  logger.log(logger.INFO, 'HITTING MODEL MIDDLEWARE');
  // /api/:model
  return modelMapPromise()
    .then((modelMap) => {
      const modelParamsExists = request.params && request.params.model;
      const model = modelParamsExists ? request.params.model : '';
      if (modelMap[model]) {
        request.model = modelMap[model].default;
        logger.log(logger.INFO, 'MODEL  MIDDLEWARE: Succesfully attached model to request');
        return next();
      }
      logger.log(logger.ERROR, 'MODEL MIDDLEWARE: Made a bad request for a model that doesn\'t exist');
      return next(new HttpErrors(400, 'You did not enter a proper Mongoose model'));
    })
    .catch(next);
};
