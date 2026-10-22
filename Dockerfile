# Etapa 1: Build de la aplicación Angular
FROM node:22-alpine AS build

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm ci --legacy-peer-deps

# Copiar el código fuente
COPY . .

# Build de producción
RUN npm run build -- --configuration production

# Etapa 2: Servir con nginx
FROM nginx:alpine

# Copiar archivos compilados desde la etapa de build
COPY --from=build /app/dist/pokemon-app/browser /usr/share/nginx/html

# Copiar configuración personalizada de nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer puerto 80
EXPOSE 80

# Comando por defecto
CMD ["nginx", "-g", "daemon off;"]
