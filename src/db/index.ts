import mongoose, { Schema, Document } from 'mongoose';
import { hash, genSalt } from 'bcrypt';
import { SystemConstants } from '../constants';

export interface UserDocument extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  olhsInfo: {
    firstName: string;
    lastName: string;
    otherNames: string;
    yearOfEntry: string;
    yearOfGraduation: string;
    postHeldInSchool: string
  },
  personalInfo: {
    residentialAddress: string;
    stateOfResidence: string;
    countryOfResidence: string;
    dateOfBirth: string;
    profession: string;
    positionInPlaceOfWork: string;
    lgaOfOrigin: string;
    stateOfOrigin: string;
  }
}

const UserSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  olhsInfo: {
    firstName: String,
    lastName: String,
    otherNames: String,
    yearOfEntry: String,
    yearOfGraduation: String,
    postHeldInSchool: String
  },
  personalInfo: {
    residentialAddress: String,
    stateOfResidence: String,
    countryOfResidence: String,
    dateOfBirth: String,
    profession: String,
    positionInPlaceOfWork: String,
    lgaOfOrigin: String,
    stateOfOrigin: String
  }
});

UserSchema.pre<UserDocument>("save", async function(next) {
  let password: string = this.password;
  let salt = await genSalt(10);
  password = await hash(password, salt);
  this.password = password;
  next();
});

export const UserModel = mongoose.model<UserDocument>("User", UserSchema);

// make a connection from the app to the database
export const connectDb = async () => {
  return mongoose.connect(process.env[SystemConstants.MONGODB_URL], {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
};