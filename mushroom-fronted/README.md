

// Docker
# Stage 1: Build Vite
FROM node:20 as build
WORKDIR /app

# ติดตั้ง dependencies
COPY package*.json ./
RUN npm install --legacy-peer-deps

# copy source code และ build
COPY . .
RUN npm run build   # จะสร้าง /app/dist

# Stage 2: Serve with Nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

# ถ้าคุณมี config custom สำหรับ SPA
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]



//nginx.conf
server {
  listen 80;

  root /usr/share/nginx/html;
  index index.html;

  location / {
    try_files $uri /index.html;
  }
}


// Run
docker build -t my-frontend .
docker run -d -p 3004:80 --name frontend my-frontend

// Stop
docker stop frontend
docker rm frontend