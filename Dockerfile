FROM node:alpine AS base

# get the DOCKER_WORKDIR from above (cli or docker-compose)
ARG DOCKER_WORKDIR

# Select the work directory 
WORKDIR $DOCKER_WORKDIR

# Build node_modules in as low a layer as possible (to avoid slow build times)
COPY package*.json ./
RUN npm i

# copy config for the app over
COPY .env tsconfig.json ./

# copy the actual app over to the src file
COPY src ./src/

# if in a production environment (not using docker-compose)
FROM base AS build

# build the app and 
CMD ls && npm run build && npm run start
