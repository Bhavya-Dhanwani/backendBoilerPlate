const swaggerUi = require('swagger-ui-express');

const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'audit-zero-final API Documentation',
    version: '1.0.0',
    description: 'Production-ready Express Backend API Specs'
  },
  servers: [
    { url: 'http://localhost:' + (process.env.PORT || 5000) + '/api/v1', description: 'Development Server' }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    }
  }
};

function setupSwagger(app) {
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

module.exports = { setupSwagger };
