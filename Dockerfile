FROM TODO ADD YOUR IMAGE HERE

ENV SERVICES="http://localhost:8500/v1/catalog/services"
ENV SWAGGERLOCATION="TODO add swagger location for each service to be checked.api-docs/swagger.json"
ENV GREYLOGSERVICE="TODO ADD greylog endpoint"
ENV GREYLOGPORT=9000
ENV SERVICEINFO="http://localhost:8500/v1/catalog/service/"
ENV SWAGGERJSON="/api-docs/swagger.json"
ENV STAGINGBASEPATH=""
ENV PROTOCOL="http://"

ENV PRODBASEPATH="add prod base path "
ENV HTTPSPROTOCOL="https://"

RUN tk-install curl && \
    apt-get update -y && \
    apt-get install --reinstall make && \
    apt-get clean

RUN \
curl -sL https://deb.nodesource.com/setup_10.x \
| bash

RUN apt-get install -y nodejs

ADD . /src

ADD deploy/api-docs.conf /etc/supervisor/conf.d/
ADD deploy/run-api-docs.sh /usr/local/bin/

ADD /meta/manifest.json /meta/manifest.json
ADD deploy/consul.json /etc/consul.d/consul-service.json

ADD deploy/api-docs.conf /etc/supervisor/conf.d/
ADD deploy/run-api-docs.sh /usr/local/bin/

RUN mkdir /home/45821 && \
    useradd -r 45821 -u 45821 && \
    chmod +x /usr/local/bin/run-api-docs.sh && \
    mkdir /opt/api-docs && \
    chmod +rwx /usr/local/ && chmod +rwx /src/ && \
    chmod +rwx /src && chmod +rwx /home/45821 && \
    chown -R 45821 /usr/local/ && \
    chown -R 45821 /src/ && \
    chown -R 45821 /home/45821/


WORKDIR /src

RUN npm install




