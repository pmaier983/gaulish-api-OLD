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
  // TODO: use a task
  async (request, accessToken, refreshToken, profile, done) => {
    // STEP 1 Check that the user is verified. If not reject.
    if (!profile.email_verified || !profile.verified) {
      // prevent a unverified user from creating an account to avoid
      // account theft via fake email creation (once I have multiple Auths setup)
      return done(Error("You must verify your Account to log in"))
    }

    const userEmail = profile.email

    const isUserInDb = await db.query(
      "SELECT 1 FROM public.user WHERE email = $1",
      userEmail
    )

    // TODO: Possible better pepper strategy out there (symmetrical encryption)
    // https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html#peppering
    // TODO stop using email as password... find a better way to do this.
    const userRawPassword = PASSWORD_PEPPER + profile.email

    // STEP 2: if there is not user in the DB create one.
    if (!isUserInDb.length) {
      const newUserInfo = {
        email: userEmail,
        password: await argon2.hash(userRawPassword),
        time_created: Date.now(),
        username: "NamelessSailor",
        username_update_time: 0, // default date is start of epoch
      }
      // insert them into the database
      db.query(
        "INSERT into public.user (password, time_created, email, username, username_update_time) VALUES (${password}, ${time_created}, ${email}, ${username}, ${username_update_time})",
        newUserInfo
      )
    }

    // STEP 3: Fetch your user (possibly newly created) and verify their password
    const hashedPassword = await db.query(
      "SELECT password FROM public.user WHERE email = $1",
      userEmail
    )

    const isPasswordVerified = await argon2.verify(
      hashedPassword?.[0]?.password,
      userRawPassword
    )

    if (!isPasswordVerified) {
      return done(Error("Your username and password did not match"))
    }

    const user = await db.query(
      "SELECT email, time_created, username, uuid, username_update_time FROM public.user WHERE email = $1",
      userEmail
    )

    // This should never happen...
    if (!user.length || user.length >= 2) {
      // TODO add logging here
      return done(Error("Something went wrong, Please try again"))
    }

    // User.findOrCreate({ googleId: profile.id }, function (err, user) {
    //   return done(err, user)
    // })
    done(null, user[0])
  }
)
