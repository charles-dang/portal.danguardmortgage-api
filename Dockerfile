FROM node:13.8.0

RUN mkdir -p /application
WORKDIR /application

COPY ./config ./config
COPY ./src ./src
COPY ./package.json ./package.json
COPY ./node_modules ./node_modules

RUN groupadd -r application_user \
   && useradd -m -r -g application_user application_user


CMD /bin/sh -c "node ./src/index.js"

EXPOSE 3000