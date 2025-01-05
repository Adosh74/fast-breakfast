import { Router } from 'express';
import { userRoutes } from './APIs/user';
import { healthCheckRouter } from './APIs/health-check';

const routes = Router();

routes.use(healthCheckRouter);

routes.use('/users', userRoutes);

export { routes };
