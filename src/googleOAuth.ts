// import passport from "passport"
import { Strategy as GoogleStrategy } from "passport-google-oauth2"

const { GOOGLE_OAUTH_CLIENT_ID, GOOGLE_OAUTH_CLIENT_SECRET } = process.env

export const googleOAuthStrategy = new GoogleStrategy(
  {
    clientID: GOOGLE_OAUTH_CLIENT_ID,
    clientSecret: GOOGLE_OAUTH_CLIENT_SECRET,
    callbackURL: "http://localhost:8080/google/callback",
    passReqToCallback: true,
  },
  function (request, accessToken, refreshToken, profile, done) {
    console.log(
      "what are these things:",
      request,
      accessToken,
      refreshToken,
      profile
    )
    // User.findOrCreate({ googleId: profile.id }, function (err, user) {
    //   return done(err, user)
    // })
    done((err) => console.log("whoops", err), profile)
  }
)
