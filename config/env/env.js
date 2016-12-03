module.exports = {
  port: 3000,
  env: 'development',
  session: {
    secret: 'keyboard cat',
    store: {
      type: 'FileStore',
      options: {}
    }    
  },
  log: {
    error: 'grill-errors.json'
  }
};
