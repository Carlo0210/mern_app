module.exports = {
    apps: [
      {
        name: 'frontend',
        script: '../../server/server.js', // Ensure this path is correct
        watch: false, // Set to true if you want to watch for file changes
        instances: 1,
        exec_mode: 'fork', // Use 'cluster' for multi-core systems
      },
    ],
  };
  