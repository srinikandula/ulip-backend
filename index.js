// config should be imported before importing any other file
const app = require('./config/express');
const config = require('./config/config');
require('./config/dbConn');


// module.parent check is required to support mocha watch
if (!module.parent) {
  app.listen(config.PORT, () => {
    console.info(`server started on port ${config.PORT} (${config.NODE_ENV})`);
  });
}

module.exports = app;