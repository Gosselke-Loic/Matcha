FROM node:24-alpine AS build

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY pnpm-lock.yaml ./
COPY package.json ./

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm run build


FROM nginx:stable-alpine

COPY --from:build /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

# juste pour info
EXPOSE 80 443 

CMD ["nginx", "-g", "deamon off;"]
