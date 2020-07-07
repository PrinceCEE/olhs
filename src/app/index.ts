import express, { Application, json, urlencoded, Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import { connectDb } from '../db';
import morgan from 'morgan';
import session from 'express-session';
import connectMongo from 'connect-mongo';
import mongoose from 'mongoose';
import { SystemConstants } from '../constants';
import cookieParser from 'cookie-parser';
import { join } from 'path';
import passportConfig from '../strategies';
import passport from 'passport';
import routers from '../router';

export default async function(app: Application): Promise<Application> {
  let MongoStore = connectMongo(session);
  await connectDb().then(() => {
    console.log("App successfully connected to the db");
  })
  .catch(err => {
    console.log(err);
  });
  
  // setting up the app level middlewares
  app.use(morgan('dev'));
  app.use(helmet());
  app.use(session({
    secret: process.env[SystemConstants.SECRET],
    saveUninitialized: false,
    resave: false,
    cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 },
    name: SystemConstants.SESSION_NAME,
    store: new MongoStore({
      mongooseConnection: mongoose.connection
    })
  }));
  app.use(json());
  app.use(urlencoded({ extended: true }));
  app.use(cookieParser())
  app.use(express.static(join(__dirname, '../..', 'public')));
  app.use(passport.initialize())
  app.use(passport.session());
  
  passportConfig();

  // initialise the routers
  routers.forEach(router => {
    app.use(router.mountPath, router());
  });

  // setup the error
  app.use((err: Error,req: Request, res: Response, next: NewableFunction) => {
    // console.log(err);
    res.status(500).json({
      message: err.message,
      success: false
    });
  });

  app.use((req: Request, res: Response, next: NextFunction) => {
    res.status(404).json({
      message: "Resource not found",
      success: false
    });
  });

  return app; 
};