declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "development" | "production"
      CLOUDFRONT_DISTRIBUTION_ID: string
      S3_BUCKET_NAME: string
      AWS_ACCOUNT_NUMBER: string
      AWS_REGION: string
      RDS_USER: string
      RDS_HOST: string
      RDS_DATABASE: string
      RDS_PASSWORD: string
      RDS_PORT: string
      GOOGLE_OAUTH_CLIENT_ID: string
      GOOGLE_OAUTH_CLIENT_SECRET: string
      PASSWORD_PEPPER: string
      JWT_SECRET: string
      DOCKER_WORKDIR: string
      GRAPHQL_PORT: string
      FRONTEND_DEV_URL: string
      FRONTEND_URL: string
      SERVER_URL: string
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {}
