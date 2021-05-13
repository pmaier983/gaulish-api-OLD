import { Strategy as GoogleStrategy } from "passport-google-oauth2"

import { OAuthHandler } from "@/utils"

const {
  GOOGLE_OAUTH_CLIENT_ID,
  GOOGLE_OAUTH_CLIENT_SECRET,
  GRAPHQL_PORT,
} = process.env

export const googleOAuthStrategy = new GoogleStrategy(
  {
    clientID: GOOGLE_OAUTH_CLIENT_ID,
    clientSecret: GOOGLE_OAUTH_CLIENT_SECRET,
    callbackURL: `http://localhost:${GRAPHQL_PORT}/google`,
    passReqToCallback: true,
  },
  (req, accessToken, refreshToken, profile, done) => OAuthHandler(profile, done)
)
