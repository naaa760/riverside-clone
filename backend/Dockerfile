FROM node:18-alpine

WORKDIR /app

# Install ffmpeg for video processing
RUN apk add --no-cache ffmpeg

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Create storage directories
RUN mkdir -p storage temp

# Build TypeScript code
RUN npm run build

# Expose ports
EXPOSE 5000

# Start the application
CMD ["npm", "start"] 