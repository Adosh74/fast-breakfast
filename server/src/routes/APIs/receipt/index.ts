import { Router } from 'express';
import { processReceiptRouter } from './process-receipt';
import { allReceiptsRouter } from './all-receipts';

const router = Router();

router.use(processReceiptRouter);
router.use(allReceiptsRouter);

export { router as receiptRouter };
