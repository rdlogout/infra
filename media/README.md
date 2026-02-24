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
- `mode` (optional): Set to `info` to return only metadata without file content

Response headers:
- `X-Info`: JSON object containing media metadata

X-Info JSON structure:
```json
{
  "type": "image|video|audio",
  "width": 480,
  "height": 360,
  "duration": 10.5,  // only for video/audio
  "size": 15820      // file size in bytes
}
```

Behavior:
- Images: Returns original or resized image (if width/height provided)
- Videos: Returns thumbnail extracted at 1 second (resized if width/height provided)
- Audio: Returns original file
- mode=info: Returns empty response with only X-Info header

## Deploy on Coolify

Use the included Dockerfile for deployment.
