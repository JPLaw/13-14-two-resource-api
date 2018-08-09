'use strict';

import mongoose from 'mongoose';

/*
  SQL equivalent:
  CREATE TABLE MUSEUM (
    name VARCHAR,
    art VARCHAR,
    patrons VARCHAR,
  )
*/

const theMuseumSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  art: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'art',
    },
  ],
  patrons: {
    type: String,
    default: 'Jenny',
    enum: ['Jenny', 'Ashton', 'Karen', 'Noah'],
  },
}, { timestamps: true });

theMuseumSchema.pre('findOne', function preHookCallback(done) {
  this.populate('art');
  done();
});

const skipInit = process.env.NODE_ENV === 'development';
export default mongoose.model('museum', theMuseumSchema, 'museum', skipInit);
