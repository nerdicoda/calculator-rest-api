import { Request, Router } from 'express';

export const router = Router();

router.get('/', (req: Request, res) => {
  res.send({ message: 'OK', timestamp: req.timestamp });
});
