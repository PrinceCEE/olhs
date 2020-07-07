import { Router } from 'express';
import { IRouter } from '../interfaces';
import Controllers from '../controllers';
import Middlewares from '../middlewares';

let routers: IRouter[];

const authRouter: IRouter = (): Router => {
  const { AuthController } = Controllers;
  const { AuthMiddleware } = Middlewares;
  const authRoute: Router = Router();

  // initialising register end points
  authRoute.post('/register/basic', AuthMiddleware.validateRegisterDto, AuthController.registerUser);
  authRoute.post('/register/olhs-info', AuthMiddleware.validateOlhsInfoDto, AuthController.updateOlhsDetails);
  authRoute.post('/register/personal-info', AuthMiddleware.validatePersonalInfoDto, AuthController.updatePersonalInfo);

  // initialising login end points
  authRoute.post('/login', AuthMiddleware.validateLoginDto, AuthController.loginUser);
  return authRoute;
};
authRouter.mountPath = '/auth';

routers = [
  authRouter
];

export default routers;