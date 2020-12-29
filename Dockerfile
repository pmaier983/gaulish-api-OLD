FROM node:alpine

# Select the work directory 
WORKDIR /usr/src 

# Build node_modules in as low a layer as possible (to avoid slow build times)
COPY package-lock.json ./
RUN npm i

# copy the app & scripts over 
COPY .env package.json ./
COPY src ./

EXPOSE 3001

CMD npm run dev
