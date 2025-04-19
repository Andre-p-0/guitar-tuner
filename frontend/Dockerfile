# Sets the node version required to run React app and install dependencies
FROM node:23

# Sets the working directory inside the container to /app
WORKDIR /app

# Copies package.json and package-lock.json into container
COPY package*.json ./ 
# Installs all frontend dependencies in package.json
RUN npm install

# Copies everything from local frontend/ folder into the containers /app directory
COPY . .

# Tells Docker this container will listen on port 3000
# Doesn't actually open the port - just a metadata hint
EXPOSE 3000
# The command that runs when the container starts
# This will launch your dev serer (localhost:3000)
CMD ["npm", "run", "dev"]