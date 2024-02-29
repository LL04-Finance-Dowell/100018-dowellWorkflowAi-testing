# Use a lighter base image
FROM node:18-alpine AS builder

# Set the working directory
WORKDIR /app/frontend/

# Copy only the package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install --production && npm cache clean --force

# Copy the rest of the application
COPY . .

# Build the application (if needed)
RUN npm run build

# Use a minimal image for production
FROM node:18-alpine

# Set the working directory
WORKDIR /app/frontend/

# Copy only the built artifacts from the builder stage
COPY --from=builder /app/frontend/build/ ./build/

# Expose the port (if needed)
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]
