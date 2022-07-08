import { Strategy as GoogleStrategy } from "passport-google-oauth2"
import argon2 from "argon2"
import jwt from "jsonwebtoken"

import db from "./database"

const {
  GOOGLE_OAUTH_CLIENT_ID,
  GOOGLE_OAUTH_CLIENT_SECRET,
  GRAPHQL_PORT,
  FRONTEND_DEV_URL,
  JWT_SECRET,
} = process.env

// TODO: setup refresh token pattern
export const OAuthHandler = (
  profile, // TODO: PR to update Profile interface email_verified
  done: (
    error: Error | null,
    user?: any | boolean, // TODO: specify user object
    { message }?: { message: string }
  ) => void
) =>
  db.task(async (taskDb) => {
    // STEP 1 Check that the user is verified. If not reject.
    if (!profile.email_verified || !profile.verified || !profile.email) {
      // prevent a unverified user from creating an account to avoid
      // account theft via fake email creation (once I have multiple Auths setup)
      return done(Error("You must verify your Gmail Account to log in"))
    }

    const userEmail = profile.email

    const countOfUsersInDbWithEmail = await taskDb.oneOrNone(
      "SELECT count(*) FROM public.user WHERE email = $1",
      userEmail,
      ({ count }) => parseInt(count, 10)
    )

    // If there are multiple users with the same email in the db something went wrong
    if (countOfUsersInDbWithEmail > 1) {
      return done(
        Error("There seems to be two of you... Something must be wrong")
      )
    }

    // TODO: Possible better pepper strategy out there (symmetrical encryption)
    // https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html#peppering
    // TODO stop using email as password... find a better way to do this.
    const userRawPassword = process.env.PASSWORD_PEPPER + profile.email

    // TODO: dont use a let here... keeps things immutable
    let isNewUser = false

    // STEP 2: if there is not user in the DB create one.
    if (countOfUsersInDbWithEmail === 0) {
      const countOFUsersInDb = await taskDb.one(
        "SELECT count(*) FROM public.user",
        {},
        ({ count }) => parseInt(count, 10)
      )
      const newUserInfo = {
        email: userEmail,
        password: await argon2.hash(userRawPassword),
        time_created: Date.now(),
        username: `NamelessSailor_${countOFUsersInDb}`,
        username_update_time: 0, // default date is start of epoch
      }

      // insert them into the database
      await taskDb.none(
        "INSERT into public.user (password, time_created, email, username, username_update_time) VALUES (${password}, ${time_created}, ${email}, ${username}, ${username_update_time})",
        newUserInfo
      )

      isNewUser = true
    }

    // STEP 3: Fetch your user (possibly newly created) and verify their password
    const fullUser = await taskDb.one(
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

    if (isNewUser) {
      // Give the new user a beginner ship in a random city
      const cityIDs = await taskDb.any("select city_id from public.city")

      const randomCityID =
        cityIDs[Math.floor(Math.random() * cityIDs.length)].city_id

      await taskDb.none(
        "insert into public.ship (name, city_id, uuid, ship_type_id, is_sunk) values ('GoingMerry', ${randomCityID}, ${uuid}, 1, false)",
        { ...fullUser, randomCityID }
      )
    }

    return done(null, userLessPassword)
  })

// TODO: Type these
export const authCallback = (req, res) => {
  // TODO: how to properly handle Errors next(error?)
  if (!req?.user) {
    throw Error("Something went very wrong")
  }
  // TODO: how not to send via url
  res.redirect(
    `${FRONTEND_DEV_URL}/?token=${jwt.sign(req.user, JWT_SECRET, {
      expiresIn: "30 days",
    })}`
  )
}

export const googleOAuthStrategy = new GoogleStrategy(
  {
    clientID: GOOGLE_OAUTH_CLIENT_ID,
    clientSecret: GOOGLE_OAUTH_CLIENT_SECRET,
    callbackURL: `http://localhost:${GRAPHQL_PORT}/google`,
    passReqToCallback: true,
  },
  (req, accessToken, refreshToken, profile, done) => OAuthHandler(profile, done)
)
