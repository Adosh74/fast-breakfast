import { Router, Request, Response, NextFunction } from 'express';

const router = Router();

router.get('/healthz', (_req: Request, res: Response, next: NextFunction) => {
	res.sendStatus(200);
});

export { router as healthCheckRouter };
