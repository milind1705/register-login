const passport = require('passport')

const GoogleStrategy = require('passport-google-oauth2').Strategy;

const GOOGLE_CLIENT_ID = "1043955095538-v0vnbjbntnn4uphmvu3acd5nh9krqkb2.apps.googleusercontent.com"
const GOOGLE_CLIENT_SECRET = "3WrBFX9aNdxPVpcFu4mLivvY"

passport.use(new GoogleStrategy({
    clientID:     GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:4444/google/callback",
    passReqToCallback   : true
  },
  function(request, accessToken, refreshToken, profile, done) {
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return done(err, profile);
    });
  }
));

