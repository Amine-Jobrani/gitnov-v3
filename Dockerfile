# Build stage
FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build

# Production stage
FROM nginx:1.25

# Copy built assets
COPY --from=builder /app/dist /usr/share/nginx/html

# Create log directory with proper permissions
RUN mkdir -p /var/log/nginx && \
    touch /var/log/nginx/access.log /var/log/nginx/error.log && \
    chown -R nginx:nginx /var/log/nginx && \
    chmod 755 /var/log/nginx && \
    chmod 644 /var/log/nginx/*.log

# Copy your server configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Remove the default nginx configuration to avoid conflicts
RUN rm -f /etc/nginx/conf.d/default.conf.dpkg-dist

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]