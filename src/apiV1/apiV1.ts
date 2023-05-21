import { Router } from 'express';
import { divisionRouter } from './division/division.route';
import { organizationRouter } from './organization/organization.route';
import { verseListRouter } from './verse-list/verseList.route';
import { featureFlagRouter } from './featureFlags/featureFlag.router';
import { versionRouter } from './version/version.router';

const router: Router = Router();

router.use('/division', divisionRouter);
router.use('/organization', organizationRouter);
router.use('/verseList', verseListRouter);
router.use('/featureFlag', featureFlagRouter);
router.use('/versions', versionRouter);

export default router;
