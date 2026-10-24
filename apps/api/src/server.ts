import app from './app';
import { config } from './config/env';

const server = app.listen(config.port, () => {
  console.log(`\n========================================`);
  console.log(`🚀 Amar Dokan API server is running!`);
  console.log(`📍 URL: http://localhost:${config.port}`);
  console.log(`🩺 Health: http://localhost:${config.port}${config.apiPrefix}/health`);
  console.log(`⚙️  Environment: ${config.nodeEnv}`);
  console.log(`========================================\n`);
});

const handleShutdown = (signal: string) => {
  console.log(`\n[${signal}] Initiating graceful shutdown...`);
  server.close(() => {
    console.log('[Server] HTTP connections closed.');
    process.exit(0);
  });

  // Force shutdown after timeout if connections hang
  setTimeout(() => {
    console.error('[Server] Could not close connections in time, forcefully shutting down.');
    process.exit(1);
  }, 10000).unref();
};

process.on('SIGINT', () => handleShutdown('SIGINT'));
process.on('SIGTERM', () => handleShutdown('SIGTERM'));

export default server;
