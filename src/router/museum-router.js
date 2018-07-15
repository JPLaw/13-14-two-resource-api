'use strict';

import { Router } from 'express';
import logger from '../lib/logger';
import Museum from '../model/museum';


const museumRouter = new Router();

museumRouter.post('/api/museum', (request, response, next) => {
  Museum.init()
    .then(() => {
      logger.log(logger.INFO, `MUSEUM ROUTER BEFORE SAVE: Saved a new museum ${JSON.stringify(request.body)}`);
      return new Museum(request.body).save();
    })
    .then((newMuseum) => {
      logger.log(logger.INFO, `MUSEUM ROUTER AFTER SAVE: Saved a new museum ${JSON.stringify(newMuseum)}`);
      return response.json(newMuseum);
    })
    .catch(next);
  return undefined;
});

museumRouter.get('/api/museum/:id?', (request, response, next) => {
  Museum.init()
    .then(() => {
      return Museum.findOne({ _id: request.params.id });
    })
    .then((foundMuseum) => {
      logger.log(logger.INFO, `MUSEUM ROUTER: FOUND THE MODEL, ${JSON.stringify(foundMuseum)}`);
      response.json(foundMuseum);
    })
    .catch(next);
});

museumRouter.put('/api/museum/:id?', (request, response, next) => { 
  if (!request.body.name) {
    const error = new Error();
    error.status = 400;
    return next(error);
  }
  
  Museum.init()
    .then(() => {
      logger.log(logger.INFO, `MUSEUM ROUTER BEFORE PUT: Updating museum ${JSON.stringify(request.body)}`);
    
      const options = {
        new: true,
        runValidators: true,
      };
        
        // console.log(request.body, 'PUT REQUEST BODY');
      return Museum.findByIdAndUpdate(request.params.id, request.body, options);
    })
    .then((updatedMuseum) => {
      if (!updatedMuseum) {
        const error = new Error();
        error.status = 404;
        return next(error);
      }
      logger.log(logger.INFO, `MUSEUM ROUTER AFTER PUT: Updated museu, details ${JSON.stringify(updatedMuseum)}`);
      console.log(updatedMuseum, 'UPDATED MUSEUM'); /* eslint-disable-line*/
      return response.json(updatedMuseum);
    })
    .catch(next);
  return undefined;
});


export default museumRouter;
