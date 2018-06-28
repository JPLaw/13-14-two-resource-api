import { Router } from 'express';
import HttpErrors from 'http-errors';
import logger from '../lib/logger';
import Art from '../model/art';

const artRouter = new Router();

artRouter.post('/api/art', (request, response, next) => {
  Art.init()
    .then(() => {
      logger.log(logger.INFO, `ART ROUTER: POST BEFORE SAVE: ${JSON.stringify(request.body)}`);
      return new Art(request.body).save();
    })
    .then((newArt) => {
      logger.log(logger.INFO, `ART ROUTER: POST AFTER SAVE: ${JSON.stringify(newArt)}`);
      response.json(newArt);
    })
    .catch(next);
});

artRouter.get('/api/art/:id?', (request, response, next) => {
  if (!request.params.id) {
    return next(new HttpErrors(400, 'Did not enter and ID'));
  }

  Art.init()
    .then(() => {
      return Art.findOne({ _id: request.params.id });
    })
    .then((foundArt) => {
      logger.log(logger.INFO, `ART ROUTER: AFTER GETTING ART ${JSON.stringify(foundArt)}`);
      return response.json(foundArt);
    })
    .catch(next);
  return undefined;
});

export default artRouter;
