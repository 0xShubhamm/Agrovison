# Build the existing Vite/React application.
FROM node:20-alpine AS build
WORKDIR /app

COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ ./
RUN npm run build

# Serve the static Vite build with Nginx and support React Router deep links.
FROM nginx:1.27-alpine
COPY --from=build /app/dist/ /usr/share/nginx/html/
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget -q -O /dev/null http://127.0.0.1/ || exit 1
