FROM node:lts

WORKDIR /app
COPY . .

RUN npm x -y pnpm install

RUN npm x -y pnpm run build

EXPOSE 3000

CMD [ "npm", "x", "-y", "pnpm", "run", "start" ]