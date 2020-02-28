FROM node:12.16.1-alpine

RUN apk add --no-cache fontconfig font-noto-cjk && fc-cache -fv
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    freetype-dev \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    nodejs \
    yarn
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
RUN yarn add puppeteer@2.1.1
RUN addgroup -S pptruser && adduser -S -g pptruser pptruser \
    && mkdir -p /app/screenshot \
    && chown -R pptruser:pptruser /home/pptruser \
    && chown -R pptruser:pptruser /app
USER pptruser
WORKDIR /app
COPY . /app
CMD ["node", "amazon.js"]
