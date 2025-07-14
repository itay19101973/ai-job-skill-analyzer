FROM node:18
WORKDIR /app

# Install npm packages
COPY package*.json ./
RUN npm install

# Copy the rest of the files
COPY . .

EXPOSE 5000

RUN chmod +x ./entrypoint.sh

ENTRYPOINT ["./entrypoint.sh"]
