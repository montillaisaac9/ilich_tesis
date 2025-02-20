# Usa la imagen oficial de Node.js como base
FROM node:18

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copia los archivos de dependencias
COPY package.json package-lock.json ./

# Instala las dependencias
RUN npm install --legacy-peer-deps 

# Copia el resto del código de la aplicación al contenedor
COPY . .

# Expone el puerto de Next.js
EXPOSE 3000

# Inicia la aplicación en modo producción
CMD ["npm", "run", "start"]
