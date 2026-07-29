require('dotenv').config();
const createApp = require('./src/app');
const connectDB = require('./src/config/db.config');
const env = require('./src/config/env.config');
const logger = require('./src/config/logger.config');

async function startServer() {
	const app = createApp();

	await connectDB();

	app.listen(env.PORT || 5000, () => {
		logger.info(`Server is running on port ${env.PORT || 5000}`);
	});
}

startServer();
