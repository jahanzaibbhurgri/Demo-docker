# Use the official Node.js image as the base image
FROM node:latest

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./app

# Install dependencies
RUN npm install -g npm@latest

# Copy the rest of the application code to the container
COPY . ./app

# Expose the port the app runs on
EXPOSE 30007

# Command to run your application
CMD ["bash", "-c", "npx prisma generate && npx prisma migrate dev --name "jahanzaib" && npm start"]
