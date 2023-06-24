FROM node:16-alpine

# Create Directory for the Container
WORKDIR /app

# Only copy the package.json file to work directory
COPY package.json package-lock.json tsconfig.json ./

# Install all Packages
RUN npm install

# Copy all other source code to work directory
COPY . ./

EXPOSE 7002

# Start
ENTRYPOINT ["npm", "run", "dev"]