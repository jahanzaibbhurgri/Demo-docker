# Use the official Node.js image as the base image
FROM node:latest as builder

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install dependencies, including devDependencies
RUN NODE_ENV=development npm install

# Copy the rest of the application code to the container
COPY . .

# Run TypeScript compiler (if applicable)
RUN npx tsc

# Change ownership if switching to a non-root user later
RUN chown -R node:node /app

# Expose the port the app runs on
EXPOSE 3000

# Switch to a non-root user (if needed)
# USER node

# Command to run your application
CMD ["bash", "-c", "npx prisma generate && npx prisma migrate dev --name jahanzaib && npm start"]
