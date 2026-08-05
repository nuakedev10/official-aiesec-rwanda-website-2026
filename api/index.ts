import serverless from 'serverless-http';
import { createApp } from '../src/app';

// Create the Express app instance and export a serverless handler for Vercel
const app = createApp();

export default serverless(app);
