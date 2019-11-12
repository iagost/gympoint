import { Router } from'express';

import SessionController from './app/controllers/SessionController';
import UserController from './app/controllers/UserController';
import authMiddleware from './app/middlewares/auth';
import StudentController from './app/controllers/StudentController';

const routes = new Router();

routes.post("/sessions", SessionController.store)

routes.use(authMiddleware);

routes.post("/users", UserController.store);
routes.put("/users", UserController.update);

routes.post("/students", StudentController.store);
routes.put("/students", StudentController.update);

export default routes;