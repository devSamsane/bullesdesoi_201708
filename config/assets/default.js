module.exports = {
  client: {

  },
  server: {
    allJS: ['server.js', 'config/**/*.js', 'server/**/*.js'],
    models: ['server/models/*.js'],
    routes: ['server/routes/*.js'],
    config: ['server/config/*.js'],
    policies: ['server/config/policies/*.js']
  }
};
