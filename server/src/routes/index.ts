import { Router } from 'express';
import { userRoutes } from './APIs/user';
import { healthCheckRouter } from './APIs/health-check';
import { itemRoutes } from './APIs/item';
import { orderRouter } from './APIs/order';

const routes = Router();

routes.use(healthCheckRouter);

routes.use('/users', userRoutes);
routes.use('/items', itemRoutes);
routes.use('/orders', orderRouter);

export { routes };
