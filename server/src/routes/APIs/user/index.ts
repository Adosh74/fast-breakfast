import { Router } from 'express';

import { signinRouter } from './signin';
import { currentUserRouter } from './current-user';
import { signoutRouter } from './signout';
import { signupRouter } from './signup';
import { allUsersRouter } from './all-users';
import { updateUserRouter } from './update-user';

const userRoutes = Router();

userRoutes.use(currentUserRouter);
userRoutes.use(signinRouter);
userRoutes.use(signoutRouter);
userRoutes.use(signupRouter);
userRoutes.use(allUsersRouter);
userRoutes.use(updateUserRouter);

export { userRoutes };
