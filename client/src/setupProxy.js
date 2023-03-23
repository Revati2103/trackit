const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/',
    createProxyMiddleware({
      target: 'http://localhost:5500', // Change to the URL of your server
      changeOrigin: true,
    })
  );
};
