import * as express from 'express';
import { InferSchemaType, Types } from 'mongoose';
import { userSchema } from './models/user.model.js';

declare module 'express-serve-static-core' {
  interface Request {
    user: InferSchemaType<typeof userSchema> & {_id: string | Types.ObjectId};
  }
}
declare module 'express' {
  interface Request {
    user: InferSchemaType<typeof userSchema> & {_id: string | Types.ObjectId};
  }
}