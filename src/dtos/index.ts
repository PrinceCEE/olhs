export class RegistrationDto {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
}

export class OlhsInfoDto {
  firstName: string;
  lastName: string;
  otherNames: string;
  yearOfEntry: string;
  yearOfGraduation: string;
  postHeldInSchool: string;
}

export class PersonalInfoDto {
  residentialAddress: string;
  stateOfResidence: string;
  countryOfResidence: string;
  dateOfBirth: string;
  profession: string;
  positionInPlaceOfWork: string;
  lgaOfOrigin: string;
  stateOfOrigin: string;
}

export class LoginDto {
  email: string;
  password: string;
  registration?: boolean;
}