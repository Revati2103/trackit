const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      //target: 'http://localhost:5500', // Change to the URL of your server
      target: 'https://trackit-backend-bhj0.onrender.com/',
      changeOrigin: true,
    })
  );
};
