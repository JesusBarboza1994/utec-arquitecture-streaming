FROM node:22

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos de tu aplicación al contenedor
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto del código
COPY . .

# Expone el puerto que tu aplicación utiliza
EXPOSE 3000

# Comando para iniciar tu aplicación
CMD ["npm", "start"]