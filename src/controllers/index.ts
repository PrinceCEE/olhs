import { UserDocument, UserModel } from '../db';
import { RegistrationDto, OlhsInfoDto, PersonalInfoDto, LoginDto } from '../dtos';
import { Model } from 'mongoose';
import { Request, Response, NextFunction, Application } from 'express';
import { authenticate } from 'passport';

interface AppExtension extends Application {
  handle(req: Request, res: Response): void;
}

class AuthController {
  constructor(private userModel: Model<UserDocument>) {
    this.registerUser = this.registerUser.bind(this);
    this.loginUser = this.loginUser.bind(this);
    this.updateOlhsDetails = this.updateOlhsDetails.bind(this);
    this.updatePersonalInfo = this.updatePersonalInfo.bind(this);
  }

  async registerUser(req: Request, res: Response, next: NextFunction) {
    let registrationDto: RegistrationDto,
          user: UserDocument;
    try {
      registrationDto = req.body;
      user = new this.userModel({
        firstName: registrationDto.firstName,
        lastName: registrationDto.lastName,
        email: registrationDto.email,
        phoneNumber: registrationDto.phoneNumber,
        password: registrationDto.password
      });

      user = await user.save();
    }
    catch (err) {
      return next(new Error(err.message));
    }

    let loginDto: LoginDto = {
      email: registrationDto.email,
      password: registrationDto.password,
      registration: true
    };

    req.url = '/auth/login';
    req.baseUrl = req.url;
    req.body = loginDto;
    req.method = "POST";
    (req.app as AppExtension).handle(req, res);
  }

  async loginUser(req: Request, res: Response, next: NextFunction) {
    let loginDto: LoginDto = req.body;
    let redirect: string;
    if(loginDto.registration) {
      redirect = '/auth/register/olhs-info';
    }
    else {
      redirect = '/';
    }

    authenticate('local', (err, user, info) => {
      if(err) {
        return next(new Error(err.message));
      }

      if(!user) {
        return next(new Error(info.message));
      }

      req.logIn(user, err => {
        if(err) {
          return next(new Error(err.message));
        }

        res.status(200).json({
          success: true,
          message: "Registration successful",
          redirect
        });
      });
    })(req, res, next);
  }

  async updateOlhsDetails(req: Request, res: Response, next: NextFunction) {
    let olhsInfoDto: OlhsInfoDto = req.body,
        { email } = req.user as UserDocument;
    try {
      await this.userModel.findOneAndUpdate(
        {
          email
        },
        {
          olhsInfo: olhsInfoDto
        }
      );
    }
    catch (err) {
      return next(new Error(err.message));
    }

    res.status(200).json({
      message: "Details in Our Lady's High School Successfully updated"
    });
  }

  async updatePersonalInfo(req: Request, res: Response, next: NextFunction) {
    let personalInfoDto: PersonalInfoDto = req.body,
        { email } = req.user as UserDocument;
    try {
      await this.userModel.findOneAndUpdate(
        {
          email
        },
        {
          personalInfo: personalInfoDto
        }
      );
    }
    catch (err) {
      return next(new Error(err.message));
    }

    res.status(200).json({
      message: "Personal information successfully updated"
    });
  }
}

export default {
  AuthController: new AuthController(UserModel)
}