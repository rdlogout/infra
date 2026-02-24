import { Hono } from 'hono';
import { processRoute } from './routes/process';

const app = new Hono();

app.route('/', processRoute);

export default {
  port: 3000,
  fetch: app.fetch,
};
