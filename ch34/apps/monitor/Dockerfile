FROM node:18-alpine as builder

ENV NODE_ENV build

USER node
WORKDIR /home/node

COPY --chown=node:node . /home/node

RUN npm install \
    && npm run build monitor

# ---

FROM node:18-alpine

ENV NODE_ENV production
ENV TZ Asia/Taipei

USER node
WORKDIR /home/node

COPY --from=builder /home/node/package.json /home/node/
COPY --from=builder /home/node/package-lock.json /home/node/
COPY --from=builder /home/node/dist/ /home/node/dist/

RUN npm install --production

CMD ["node", "dist/apps/monitor/main.js"]
