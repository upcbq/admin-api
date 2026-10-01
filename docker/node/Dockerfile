FROM node:24-alpine AS builder

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

RUN mkdir -p /home/node/shared/node_modules && chown -R node:node /home/node/shared

USER node

WORKDIR /home/node/shared

COPY --chown=node:node ./shared/package*.json ./

RUN npm install

COPY --chown=node:node ../shared .

WORKDIR /home/node/app

COPY --chown=node:node ./admin-api/package*.json ./

RUN npm install

COPY --chown=node:node ./admin-api .

RUN npm run 'build:es'

FROM node:24-alpine

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

USER node

COPY --from=builder /home/node/app/dist ./dist
COPY --from=builder /home/node/app/package*.json ./

RUN npm install --omit=dev

EXPOSE 3001

CMD [ "npm", "run", "start" ]
