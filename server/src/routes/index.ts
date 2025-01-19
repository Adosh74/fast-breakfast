import { Router } from 'express';
import { userRoutes } from './APIs/user';
import { healthCheckRouter } from './APIs/health-check';
import { itemRoutes } from './APIs/item';

const routes = Router();

routes.use(healthCheckRouter);

routes.use('/users', userRoutes);
routes.use('/items', itemRoutes);

export { routes };
