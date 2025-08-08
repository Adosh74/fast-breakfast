import { Router } from 'express';
import { itemsListRouter } from './items-list';
import { addItemRouter } from './add-item';
import { updateItemRouter } from './update-item';

const router = Router();

router.use(addItemRouter);
router.use(itemsListRouter);
router.use(updateItemRouter);

export { router as itemRoutes };
