FROM node:20.11-buster-slim
RUN apt update 
RUN apt install dnsutils -y
WORKDIR /myapp
# Copiar el resto de los archivos de la aplicación
COPY . .
RUN npm install
# Compilar la aplicación (si es necesario)
RUN npm run build
CMD ["node", "server.js"]
