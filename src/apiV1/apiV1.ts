import { Router } from 'express';
import { divisionRouter } from './division/division.route';

const router: Router = Router();

router.use('/division', divisionRouter);

export default router;
