import { Router } from 'express';
import { divisionRouter } from './division/division.route';
import { organizationRouter } from './organization/organization.route';
import { verseListRouter } from './verse-list/verseList.route';

const router: Router = Router();

router.use('/division', divisionRouter);
router.use('/organization', organizationRouter);
router.use('/verseList', verseListRouter);

export default router;
