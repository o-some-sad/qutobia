import * as express from 'express';
import { InferSchemaType, Types } from 'mongoose';
import { userSchema } from './models/user.model.js';


//TODO: use user zod schema
interface ReqUser{
  _id: string,
  name: string,
  email: string,
  role: 'user' | 'admin',
  image: null

}

declare module 'express-serve-static-core' {
  interface Request {
    user: ReqUser;
  }
}
declare module 'express' {
  interface Request {
    user: ReqUser;
  }
}