FROM node:lts

WORKDIR /app
COPY . .

RUN npm x -y pnpm run build

CMD [ "npm", "x", "-y", "pnpm", "run", "start" ]