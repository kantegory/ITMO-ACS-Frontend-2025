FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ARG PORT=3000
ENV PORT=${PORT}
EXPOSE ${PORT}
CMD ["npm", "run", "dev"]