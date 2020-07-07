import setConfigs from './config';
import App from './app';
import express, { Application } from 'express';
import { SystemConstants } from './constants';

export const app: Application = express();

// set up the config variables on the process.env
function bootstrapApp(): Application {
  console.log("Application starting...");
  setConfigs();

  App(app)
  .then(app => {
    const port = process.env[SystemConstants.PORT] || 3000;
    app.listen(port, () => {
      console.log("Application started on port " + port);
    });
  });

  return app;
}

// start App
bootstrapApp();