FROM node:6.4 as base

RUN mkdir -p /src/

ADD /app/package.json /src/package.json

WORKDIR /src/

RUN npm install


# -----------------------------------------

FROM base as compiler

RUN npm install -g gulp

ADD /app/ /src/

RUN npm run build

# -----------------------------------------

FROM base as output

ENV NODE_ENV=production

RUN npm install -g http-server
RUN mkdir -p /src/

ADD /entrypoint.sh /
RUN chmod +x /entrypoint.sh

COPY --from=compiler /src/build/ /src/

ENTRYPOINT ["/entrypoint.sh"]