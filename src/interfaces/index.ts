import { Router } from 'express';

export interface IRouter {
  (): Router;
  mountPath: string;
}