import { Router } from 'express';

import { signinRouter } from './signin';
import { currentUserRouter } from './current-user';
import { signoutRouter } from './signout';
import { signupRouter } from './signup';

const userRoutes = Router();

userRoutes.use(currentUserRouter);
userRoutes.use(signinRouter);
userRoutes.use(signoutRouter);
userRoutes.use(signupRouter);

export { userRoutes };
