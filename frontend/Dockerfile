# mon-app/frontend/Dockerfile

FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Build l'app Angular pour production
RUN npm run build

# Utilise Nginx pour servir l'app en prod
FROM nginx:alpine
COPY --from=0 /app/dist/* /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
