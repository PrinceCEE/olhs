import passport from 'passport';
import { Strategy } from 'passport-local';
import { UserDocument, UserModel } from '../db';
import { compare } from 'bcrypt';

export default () => {
  passport.serializeUser((user: UserDocument, done) => {
    done(null, user.id);
  });
  
  passport.deserializeUser(async (id: string, done) => {
    await UserModel.findById(id)
    .then(user => {
      done(null, user);
    })
    .catch(err => {
      done(err, null);
    })
  });

  passport.use('local', new Strategy({
    usernameField: 'email',
    passwordField: "password"
  }, async (email, password, done) => {
    try {
      let user: UserDocument = await UserModel.findOne({ email });
      if(!user) {
        return done(null, false, { message: "You are not registered, please register" });
      }

      let isPasswordValid = await compare(password, user.password);
      if(!isPasswordValid) {
        return done(null, false, { message: "Invalid login details" });
      }

      return done(null, user);
    }
    catch (err) {
      return done(err);
    }
  }));
};