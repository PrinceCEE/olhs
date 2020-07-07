import { RegistrationDto, OlhsInfoDto, PersonalInfoDto, LoginDto } from '../dtos';
import { string, object, boolean } from '@hapi/joi';
import { Request, Response, NextFunction } from 'express';

const registerSchema = object({
  firstName: string(),
  lastName: string(),
  email: string().email(),
  phoneNumber: string(),
  password: string().min(6)
});

const olhsSchema = object({
  firstName: string(),
  lastName: string(),
  otherNames: string(),
  yearOfEntry: string(),
  yearOfGraduation: string(),
  postHeldInSchool: string()
});

const personalInfoSchema = object({
  residentialAddress: string(),
  stateOfResidence: string(),
  countryOfResidence: string(),
  dateOfBirth: string(),
  profession: string(),
  positionInPlaceOfWork: string(),
  lgaOfOrigin: string(),
  stateOfOrigin: string()
});

const loginSchema = object({
  email: string().email(),
  password: string(),
  registration: boolean()
});

class AuthMiddleware {
  validateRegisterDto(req: Request, res: Response, next: NextFunction) {
    let registerDto: RegistrationDto = req.body;
    if(Object.keys(registerDto).length == 0) {
      throw new Error("Invalid request");
    }

    const { error } = registerSchema.validate(registerDto);
    if(error) {
      throw new Error(error.message);
    }
    registerDto.email = registerDto.email.toLowerCase();
    next();
  }

  validateOlhsInfoDto(req: Request, res: Response, next: NextFunction) {
    let olhsInfoDto: OlhsInfoDto = req.body;
    const { error } = olhsSchema.validate(olhsInfoDto);
    if(error) {
      throw new Error(error.message);
    }

    next();
  }

  validatePersonalInfoDto(req: Request, res: Response, next: NextFunction) {
    let personalInfoDto: PersonalInfoDto = req.body;
    const { error } = personalInfoSchema.validate(personalInfoDto);
    if(error) {
      throw new Error(error.message);
    }

    next();
  }

  validateLoginDto(req: Request, res: Response, next: NextFunction) {
    let loginDto: LoginDto = req.body;
    const { error } = loginSchema.validate(loginDto);
    if(error) {
      throw new Error(error.message);
    }

    next();
  }
}

export default {
  AuthMiddleware: new AuthMiddleware()
};