module.exports = {
  apps: [
    {
      name: 'server',
      script: './server.js',
      env: {
        NODE_ENV: 'production',
        MONGODB_URI: 'mongodb://154.53.60.27:27017/cmsDB',
        PORT: 5000
      }
    }
  ]
};
