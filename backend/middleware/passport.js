var passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require("../models/User");

passport.serializeUser((user, next) => next(null, user))

passport.deserializeUser(async function (user, done) {
  try {
    if (user.type === 'local') {
      const userLogin = await User.findOne({ Email: user.Email });
      if (userLogin) {
        return done(null, userLogin);
      }
      return done('invalid');
    } else {
      const userLogin = await User.findOne({ Emp_Code: user.Emp_Code });
      if (userLogin) {
        return done(null, userLogin);
      }
      return done('invalid');
    }
  } catch (err) {
    return done(err);
  }
});

passport.use(new LocalStrategy({
  usernameField: "username",
  passwordField: "password",
  passReqToCallback: true,
}, async (req, username, password, callback) => {
  try {
    let user = await User.findOne({ Username: username });

    if (!user) {
      console.log("No user found");
      return callback(null, false, { message: 'No user found' });
    }

    const isVerified = bcrypt.compareSync(password, user.Password);

    if (isVerified) {
      if (user.Admin) console.log("Admin logged in!");
      else
        console.log("Logged in successfully!");

      return callback(null, user);
    }
    else {
      console.log("Password incorrect");
      return callback(null, false, { message: 'Password incorrect' });
    }
  } catch (err) {
    console.error("Error during authentication", err);
    return callback(err);

  }
}));
