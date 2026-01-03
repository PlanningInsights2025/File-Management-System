require('dotenv').config();
const app = require('./src/app');
const config = require('./src/config/env');

const PORT = config.port;

app.listen(PORT, () => {
  console.log(`\n🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${config.nodeEnv}`);
  console.log(`🌐 API: http://localhost:${PORT}/api`);
  console.log('\n✓ Server is ready to accept connections\n');
});