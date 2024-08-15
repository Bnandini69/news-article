# Step 1: Use an official Node.js runtime as a parent image
FROM node:18 AS build

# Step 2: Set the working directory in the container
WORKDIR /app

# Step 3: Copy the package.json and package-lock.json files
COPY package*.json ./

# Step 4: Install the application dependencies
RUN npm install

# Step 5: Copy the rest of the application code
COPY . .

# Step 6: Build the application for production
RUN npm run build

# Step 7: Use an Nginx image to serve the build artifacts
FROM nginx:alpine

# Step 8: Copy the build artifacts from the previous stage to Nginx's HTML directory
COPY --from=build /app/build /usr/share/nginx/html

# Step 9: Expose port 80 to allow access to the app
EXPOSE 80

# Step 10: Run Nginx
CMD ["nginx", "-g", "daemon off;"]
