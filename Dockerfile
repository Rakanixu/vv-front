FROM node:6.4 as base

RUN mkdir -p /src/

ADD /app/package.json /src/package.json

WORKDIR /src/

RUN npm install


# -----------------------------------------

FROM base as compiler

ADD /app/ /src/

RUN npm run build

# -----------------------------------------

FROM base as output

RUN mkdir -p /src/
COPY --from=compiler /src/ /src/
WORKDIR /src/app/
ENTRYPOINT ["npm", "start"]
