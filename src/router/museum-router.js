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

  museumRouter.put('/api/museum/:id?', (request, response, next) => {
    Museum.init()
      .then(() => {
        logger.log(logger.INFO, `MUSEUM ROUTER BEFORE PUT: Updating museum ${JSON.stringify(request.body)}`);
    
        console.log(request.body, 'PUT REQUEST BODY');
        return Museum.findByIdAndUpdate(request.params.id, request.body);
      })
      .then((updatedMuseum) => {
        console.log(updatedMuseum, 'UPDATED MUSEUM');
      })
      .catch(next);
  });
});

export default museumRouter;
