FROM node:8.4


RUN mkdir -p /usr/src/app
COPY . /usr/src/app/
WORKDIR /usr/src/app

RUN apt-get update -y \
&& apt-get -y install curl python build-essential git ca-certificates \
&& npm install --unsafe-perm

EXPOSE 3333
CMD npm run docker