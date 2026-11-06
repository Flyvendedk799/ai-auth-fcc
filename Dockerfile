FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
# We don't build UI for headless API proxy!
EXPOSE 4141
ENV HOST=0.0.0.0
CMD ["npm", "run", "start"]
