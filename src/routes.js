import { Router } from'express';

import SessionController from './app/controllers/SessionController';
import UserController from './app/controllers/UserController';
import authMiddleware from './app/middlewares/auth';
import StudentController from './app/controllers/StudentController';
import PlanController from './app/controllers/PlanController';
import RegistrationController from './app/controllers/RegistrationController';

const routes = new Router();

routes.post("/sessions", SessionController.store)

routes.use(authMiddleware);

routes.post("/users", UserController.store);
routes.put("/users", UserController.update);

routes.post("/students", StudentController.store);
routes.put("/students", StudentController.update);

routes.post("/plans", PlanController.store);
routes.get("/plans", PlanController.index);
routes.put("/plans/:id", PlanController.update);
routes.delete("/plans/:id", PlanController.delete);

routes.get("/registrations", RegistrationController.index);
routes.post("/registrations", RegistrationController.store);
routes.put("/registrations/:id", RegistrationController.update);
routes.delete("/registrations/:id", RegistrationController.delete);

export default routes;