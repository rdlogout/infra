FROM oven/bun:1-alpine

RUN apk add --no-cache ffmpeg

WORKDIR /app

COPY package.json bun.lockb* ./
RUN bun install --frozen-lockfile

COPY . .

EXPOSE 3000

CMD ["bun", "run", "start"]
