const { NODE_ENV, FRONTEND_DEV_URL, FRONTEND_URL } = process.env

export const isDevEnv = NODE_ENV === "development"

export const CORS = {
  origin: isDevEnv ? FRONTEND_DEV_URL : FRONTEND_URL,
  methods: "GET,PUT,POST,PATCH",
}
