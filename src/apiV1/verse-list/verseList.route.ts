import { AddVerseListVersesRequest } from '@/types/requests/verseList/AddVerseListVersesRequest';
import { CreateVerseListRequest } from '@/types/requests/verseList/CreateVerseListRequest';
import { GetVerseListByIdParams } from '@/types/requests/verseList/GetVerseListByIdParams';
import { OrganizationVerseListsParams } from '@/types/requests/verseList/OrganizationVerseListsParams';
import { RemoveVerseListVersesRequest } from '@/types/requests/verseList/RemoveVerseListVersesRequest';
import { SpecifyVerseListParams } from '@/types/requests/verseList/SpecifyVerseListParams';
import { UpdateVerseListRequest } from '@/types/requests/verseList/UpdateVerseListRequest';
import { Router } from 'express';
import verseListController from './verseList.controller';
import { validator } from '@shared/middleware/validator';

export const verseListRouter: Router = Router();

/**
 * @swagger
 *
 * /v1/verseList:
 *   post:
 *     tags:
 *       - VerseList
 *     produces:
 *       - application/json
 *     requestBody:
 *       $ref: '#/components/requestBodies/CreateVerseListRequest'
 *     responses:
 *       '200':
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VerseList'
 *   get:
 *     tags:
 *       - VerseList
 *     produces:
 *       - application/json
 *     responses:
 *       '200':
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/VerseListNoVerses'
 *
 * /v1/verseList/{verseListId}:
 *   get:
 *     tags:
 *       - VerseList
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: verseListId
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       '200':
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VerseList'
 *
 * /v1/verseList/{organization}:
 *   get:
 *     tags:
 *       - VerseList
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: organization
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       '200':
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/VerseListNoVerses'
 *
 * /v1/verseList/{organization}/{year}/{division}:
 *   put:
 *     tags:
 *       - VerseList
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: organization
 *         schema:
 *           type: string
 *         required: true
 *       - in: path
 *         name: year
 *         schema:
 *           type: integer
 *         required: true
 *       - in: path
 *         name: division
 *         schema:
 *           type: string
 *         required: true
 *     requestBody:
 *       $ref: '#/components/requestBodies/UpdateVerseListRequest'
 *     responses:
 *       '200':
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VerseList'
 *
 *   delete:
 *     tags:
 *       - VerseList
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: organization
 *         schema:
 *           type: string
 *         required: true
 *       - in: path
 *         name: year
 *         schema:
 *           type: integer
 *         required: true
 *       - in: path
 *         name: division
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       '204':
 *         description: successfully deleted
 *
 *   get:
 *     tags:
 *       - VerseList
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: organization
 *         schema:
 *           type: string
 *         required: true
 *       - in: path
 *         name: year
 *         schema:
 *           type: integer
 *         required: true
 *       - in: path
 *         name: division
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       '200':
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VerseList'
 *
 * /v1/verseList/{organization}/{year}/{division}/verses:
 *   post:
 *     tags:
 *       - VerseList
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: organization
 *         schema:
 *           type: string
 *         required: true
 *       - in: path
 *         name: year
 *         schema:
 *           type: integer
 *         required: true
 *       - in: path
 *         name: division
 *         schema:
 *           type: string
 *         required: true
 *     requestBody:
 *       $ref: '#/components/requestBodies/AddVerseListVersesRequest'
 *     responses:
 *       '200':
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VerseList'
 *
 * /v1/verseList/{organization}/{year}/{division}/verses/remove:
 *   post:
 *     tags:
 *       - VerseList
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: organization
 *         schema:
 *           type: string
 *         required: true
 *       - in: path
 *         name: year
 *         schema:
 *           type: integer
 *         required: true
 *       - in: path
 *         name: division
 *         schema:
 *           type: string
 *         required: true
 *     requestBody:
 *       $ref: '#/components/requestBodies/RemoveVerseListVersesRequest'
 *     responses:
 *       '200':
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VerseList'
 */

// Create a verse list
verseListRouter.post('/', validator.body(CreateVerseListRequest), verseListController.createVerseList);

// Update a verse list
verseListRouter.put(
  '/:organization/:year/:division',
  validator.params(SpecifyVerseListParams),
  validator.body(UpdateVerseListRequest),
  verseListController.updateVerseList,
);

// Delete a verse list
verseListRouter.delete(
  '/:organization/:year/:division',
  validator.params(SpecifyVerseListParams),
  verseListController.deleteVerseList,
);

// Get one verse list
verseListRouter.get(
  '/:organization/:year/:division',
  validator.params(SpecifyVerseListParams),
  verseListController.getVerseList,
);

// Get a verse list by id
verseListRouter.get('/:verseListId', validator.params(GetVerseListByIdParams), verseListController.getVerseListById);

// Get all verse lists
verseListRouter.get('/', verseListController.getAllVerseLists);

// Get all verse lists for an organization
verseListRouter.get(
  '/:organization',
  validator.params(OrganizationVerseListsParams),
  verseListController.getAllVerseLists,
);

// Add verses to verse list
verseListRouter.post(
  '/:organization/:year/:division/verses',
  validator.params(SpecifyVerseListParams),
  validator.body(AddVerseListVersesRequest),
  verseListController.addVerses,
);

// Remove verse from verse list
verseListRouter.post(
  '/:organization/:year/:division/verses/remove',
  validator.params(SpecifyVerseListParams),
  validator.body(RemoveVerseListVersesRequest),
  verseListController.removeVerses,
);
