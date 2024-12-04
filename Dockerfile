# # build stage
# FROM node:18-alpine AS builder

# # create app directory
# WORKDIR /app

# # a wildcard is used to ensure both package.json AND package-lock.json are copied
# COPY env*. ./
# COPY package*.json ./
# COPY prisma ./prisma/

# # install app dependencies
# RUN npm install
# RUN npm install @prisma/client -g

# # bundle app source
# COPY . .

# # creates a "dist" folder with the production build
# RUN npm run build


# # prod stage
# FROM node:18-alpine

# ARG NODE_ENV=production
# ENV NODE_ENV=${NODE_ENV}

# # WORKDIR /app

# COPY --from=builder /app/node_modules ./node_modules
# COPY --from=builder /app/package*.json ./
# COPY --from=builder /app/dist ./dist

# # COPY package*.json ./

# # RUN npm install --only=production

# # RUN rm package*.json
# EXPOSE 3000

# # Start the server using the production build
# CMD [ "npm", "run", "start:prod" ]

# FROM node:18-alpine AS builder

# # Create app directory
# WORKDIR /app

# # A wildcard is used to ensure both package.json AND package-lock.json are copied
# COPY package*.json ./
# COPY prisma ./prisma/

# # Install app dependencies
# RUN npm install

# COPY . .

# RUN npm run build

# # Run Prisma migration before starting the server
# # RUN npx prisma migrate dev

# FROM node:18-alpine 

# COPY --from=builder /app/node_modules ./node_modules
# COPY --from=builder /app/package*.json ./
# COPY --from=builder /app/dist ./dist

# EXPOSE 3000

# # Start the server using the production build
# CMD [ "npm", "run", "start:prod" ]



FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --production
RUN npm install @prisma/client

# Copy the rest of the application
COPY . .

# Expose the port on which the app will run
EXPOSE 3000

# Command to run the application
# CMD ["npm", "run", "start:prod"]
