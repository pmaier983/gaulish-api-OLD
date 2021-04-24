import { Strategy as GoogleStrategy } from "passport-google-oauth2"
import argon2 from "argon2"
import db from "./database"

const {
  GOOGLE_OAUTH_CLIENT_ID,
  GOOGLE_OAUTH_CLIENT_SECRET,
  PASSWORD_PEPPER,
} = process.env

export const googleOAuthStrategy = new GoogleStrategy(
  {
    clientID: GOOGLE_OAUTH_CLIENT_ID,
    clientSecret: GOOGLE_OAUTH_CLIENT_SECRET,
    callbackURL: "http://localhost:8080/google",
    passReqToCallback: true,
  },
  // TODO: are both async needed here?
  (req, accessToken, refreshToken, profile, done) =>
    db.task(async (t) => {
      // STEP 1 Check that the user is verified. If not reject.
      if (!profile.email_verified || !profile.verified) {
        // prevent a unverified user from creating an account to avoid
        // account theft via fake email creation (once I have multiple Auths setup)
        return done(Error("You must verify your Gmail Account to log in"))
      }

      const userEmail = profile.email

      const countOfUsersInDb = await t.oneOrNone(
        "SELECT count(*) FROM public.user WHERE email = $1",
        userEmail,
        ({ count }) => parseInt(count, 10)
      )

      // If there are multiple users with the same email in the db something went wrong
      if (countOfUsersInDb > 1) {
        return done(
          Error("There seems to be two of you... Something must be wrong")
        )
      }

      // TODO: Possible better pepper strategy out there (symmetrical encryption)
      // https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html#peppering
      // TODO stop using email as password... find a better way to do this.
      const userRawPassword = PASSWORD_PEPPER + profile.email

      // STEP 2: if there is not user in the DB create one.
      if (countOfUsersInDb === 0) {
        const newUserInfo = {
          email: userEmail,
          password: await argon2.hash(userRawPassword),
          time_created: Date.now(),
          username: "NamelessSailor",
          username_update_time: 0, // default date is start of epoch
        }
        // insert them into the database
        t.none(
          "INSERT into public.user (password, time_created, email, username, username_update_time) VALUES (${password}, ${time_created}, ${email}, ${username}, ${username_update_time})",
          newUserInfo
        )
      }

      // STEP 3: Fetch your user (possibly newly created) and verify their password
      const fullUser = await t.one(
        "SELECT * FROM public.user WHERE email = $1",
        userEmail
      )

      // This should never happen...
      if (!fullUser) {
        // TODO add logging here
        return done(Error("You don't seem to exist... Something went wrong"))
      }

      const { password, ...userLessPassword } = fullUser

      const isPasswordVerified = await argon2.verify(password, userRawPassword)

      if (!isPasswordVerified) {
        return done(null, false, {
          message: "Your username and/or password did not match",
        })
      }

      return done(null, userLessPassword)
    })
)
