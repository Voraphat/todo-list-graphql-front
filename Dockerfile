FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json (ถ้ามี)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose port (เปลี่ยนตามแอปของคุณถ้าจำเป็น)
EXPOSE 3000

# Build the application
RUN npm run build

# Start the application
CMD npm run start
