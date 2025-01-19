import { Router } from 'express';
import { itemsListRouter } from './items-list';
import { addItemRouter } from './add-item';

const router = Router();

router.use(addItemRouter);
router.use(itemsListRouter);

export { router as itemRoutes };
