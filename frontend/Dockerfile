FROM node:18
WORKDIR /app

# Install Dependencies
COPY package*.json ./
RUN npm install
RUN npm install -D tailwindcss autoprefixer postcss

# Copy remaining files
COPY . .

EXPOSE 3000

CMD ["npm", "start"]