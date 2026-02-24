# Media Processor API

Bun/Hono service for processing media files with ffmpeg.

## Usage

```bash
# Install dependencies
bun install

# Development
bun run dev

# Production
bun run start
```

## API

**GET /** 

Query parameters:
- `url` (required): URL of the media file
- `width` (optional): Target width for resize/thumbnail
- `height` (optional): Target height for resize/thumbnail

Response headers:
- `X-Info-Type`: Media type (video/image/audio)
- `X-Info-Duration`: Duration in seconds (video/audio)
- `X-Info-Width`: Original width (image/video)
- `X-Info-Height`: Original height (image/video)

## Deploy on Coolify

Use the included Dockerfile for deployment.
