# 1. Use the official Node.js image as the base
FROM node:20-alpine 

# 2. Set working directory inside the container
WORKDIR /src

# 3. Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# 4. Copy the entire project to the container
COPY . .

# 8. Expose port 5173 to access the app
EXPOSE 5173

# 9. Start Nginx
CMD ["npm", "run", "dev"]
