/**
 * @file This is the main application configuration file. It reads environment variables using the
 * DotEnv Package @see {@link https://www.npmjs.com/package/dotenv} and exports the configuration as a module.
 * @author Joseph <obochi2@gmail.com> <1/9/2020 10:05pm>
 * @since 1.0.0
 * Everytime you make changes to this file ensure to change the name, date and time
 * Last Modified: Name <email> <date & time eg 02/09/2020 5:45am>
 */

const dotenv = require('dotenv');
const bunyan = require('bunyan');

const APP_NAME = 'Buzzrom';

dotenv.config({
    path: '.env'
});



const {
    PORT,
    MONGODB_PROD_URI,
    MONGODB_LOCAL_URI,
    TWITTER_CONSUMER_KEY,
    TWITTER_CONSUMER_SECRET,
    TWITTER_CALL_BACK_URL,
    SENDGRID_KEY,
    HOST_FROM,
    NODE_ENV = 'development',
} = process.env;



// export configuration
module.exports = {
    SENDGRID_KEY,
    HOST_FROM,
    TWITTER_CONSUMER_KEY,
    TWITTER_CONSUMER_SECRET,
    TWITTER_CALL_BACK_URL,
    applicationName: APP_NAME,
    port: PORT,
    logger: bunyan.createLogger({ name: APP_NAME }),
    mongodb: {
        dsn: NODE_ENV === 'production' ? MONGODB_PROD_URI : MONGODB_LOCAL_URI,
        options: {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            autoIndex: false,
        },
    },
    production: NODE_ENV === 'production',
};