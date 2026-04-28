FROM node:18-alpine

WORKDIR /app

COPY package.json ./

RUN npm install

COPY . .

# Exposer le port par défaut de Vite (3000)
EXPOSE 3000

# Vite nécessite l'option --host pour écouter hors du conteneur
CMD ["npm", "run", "dev", "--", "--host"]