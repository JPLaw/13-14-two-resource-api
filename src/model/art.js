'use strict';

import mongoose from 'mongoose';
import Museum from './museum';

/*
  SQL equivalent:
  CREATE TABLE ART (
    title VARCHAR,
    artistName VARCHAR,
    medium VARCHAR,
    artId VARCHAR,
  )
*/


const artSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  artistName: {
    type: String,
    required: true,
  },
  medium: {
    type: String,
    default: 'Painting',
    enum: ['Painting', 'sculpture', 'sketch', 'photography'],
  },
  artId: { 
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'museum',
  },
}, { timestamps: true });

const skipInit = process.env.NODE_ENV === 'development';


export default mongoose.model('art', artSchema, 'art', skipInit);

function artPreHook(done) {
  // done is using an (error,data) signature
  // the value of 'contextual this' is the document

  /*
  SQL equivalent:
  SELECT TOP_______ FROM ART WHERE museumID = ____________
*/

  return Museum.findById(this.museumId)
    .then((foundMuseum) => {
      foundMuseum.art.push(this._id);
      return foundMuseum.save();
    })
    .then(() => done()) // done without any arguments mean success - save
    .catch(done); // done with results means an error - do not save
}

const artPostHook = (document, done) => {
  // document refers to the current instance of this student schema
  return Museum.findById(document.museumId)
    .then((foundMuseum) => {
      foundMuseum.art = foundMuseum.art.filter(art => art._id.toString() !== document._id.toString());
      return foundMuseum.save();
    })
    .then(() => done())
    .catch(done);
};

artSchema.pre('save', artPreHook);
artSchema.post('remove', artPostHook);
