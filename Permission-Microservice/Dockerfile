# Use the official Node.js image as the base image
FROM --platform=linux/amd64 node:21

# Set the working directory inside the container
WORKDIR /

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

RUN npm cache clean --force

# Clear npm cache and ensure no leftover files
RUN npm cache clean --force && rm -rf node_modules && rm -rf ~/.npm && npm install --no-audit

RUN npm install --no-audit
# Copy the rest of the application code to the container
COPY . .


# Expose the port the app runs on
EXPOSE 3000


# Command to run your application
CMD ["bash", "-c", "npx prisma generate && npx prisma migrate dev --name jahanzaib && npm start"]
