ARG NODE_VERSION=22.20.0
ARG RESIN_VERSION=2.21.0

FROM node:${NODE_VERSION}-alpine3.22 AS builder
COPY ./compiled /usr/local/lib/node_modules/resin
RUN apk add --no-cache python3 make g++ && \
    cd /usr/local/lib/node_modules/resin && \
    npm rebuild sqlite3 isolated-vm

FROM n8nio/base:${NODE_VERSION}

ARG RESIN_VERSION
ARG RESIN_RELEASE_TYPE=stable
ENV NODE_ENV=production
ENV RESIN_RELEASE_TYPE=${RESIN_RELEASE_TYPE}
ENV SHELL=/bin/sh

WORKDIR /home/node

COPY --from=builder /usr/local/lib/node_modules/resin /usr/local/lib/node_modules/resin
COPY docker/images/resin/docker-entrypoint.sh /

RUN ln -s /usr/local/lib/node_modules/resin/bin/n8n /usr/local/bin/resin && \
    mkdir -p /home/node/.n8n && \
    chown -R node:node /home/node && \
    rm -rf /root/.npm /tmp/*

EXPOSE 5678/tcp
USER node
ENTRYPOINT ["tini", "--", "/docker-entrypoint.sh"]

LABEL org.opencontainers.image.title="Resin" \
      org.opencontainers.image.description="Workflow Automation for Africa by ATS" \
      org.opencontainers.image.source="https://github.com/ATS-debug-stack/resin" \
      org.opencontainers.image.url="https://ats-resin.io" \
      org.opencontainers.image.version=${RESIN_VERSION}
