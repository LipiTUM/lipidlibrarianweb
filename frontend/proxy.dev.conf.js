const backendHost = process.env.BACKEND_HOST || 'localhost';
const backendPort = process.env.BACKEND_PORT || '8001';

module.exports = {
  '/api': {
    target: `http://${backendHost}:${backendPort}`,
    secure: false,
    changeOrigin: true,
    logLevel: 'debug'
  }
};
