const app = require('./app');
require('./dbs/init.database');
const { initRedis } = require('./dbs/init.redis');

const PORT = process.env.PORT || 3000;

initRedis()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to Redis:", error);
    process.exit(1);
  });
