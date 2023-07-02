import 'express';

declare module 'express' {
  interface Request {
    timestamp?: number;
  }
}
