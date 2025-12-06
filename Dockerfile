# -------------------------
# Build Stage
# -------------------------
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build


# -------------------------
# Production Stage
# -------------------------
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY --from=builder /app/dist ./dist

EXPOSE 4173

CMD ["npx", "vite", "preview", "--host", "0.0.0.0"]
